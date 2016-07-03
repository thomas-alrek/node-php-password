var glob = require("glob");
var path = require('path');
var algorithms = {};
var aliases = require("./package.json").aliases;

/* load algorithm modules */
glob.sync('./algorithms/*.js').forEach(function (file) {
    try{
        var algorithm = require(path.resolve(file));
        if(typeof(algorithm.name) !== 'string'){
            throw("Module has invalid name");
        }
        if(typeof algorithms[algorithm.name] !== 'undefined'){
            throw("Multiple module instances with name '" + algorithm.name + "'");
        }
        algorithms[algorithm.name] = algorithm;
        if(!(algorithms[algorithm.name].expression instanceof RegExp)){
            throw("Module has invalid expression");
        }
        if(typeof algorithms[algorithm.name].verify !== 'function'){
            throw("Module verify() is not a valid function");
        }
        if(typeof algorithms[algorithm.name].cost !== 'function'){
            throw("Module cost() is not a valid function");
        }
        if(typeof algorithms[algorithm.name].hash !== 'function'){
            throw("Module hash() is not a valid function");
        }
    }catch(e){
        throw("Invalid algorithm module");
    }
});

if(algorithms.length == 0){
    throw("exception no algorithms loaded");
}

function password_get_info(hash){
    var found = false;
    var info = {
        algoName: "",
        options: {
            cost: 0
        }
    };
    for(var key in algorithms){
        algorithms[key].expression.lastIndex = 0;
        if(algorithms[key].expression.test(hash)){
            info.algoName = algorithms[key].name;
            info.options.cost = algorithms[key].cost(hash);
            found = true;
            break;
        }
    }
    if(!found){
        throw("exception unknown algorithm");
    }
    return info;
}

function password_hash(password, algorithm, options){
    var algo;
    if(typeof algorithm == 'undefined'){
        algorithm = "PASSWORD_DEFAULT";
    }
    if(typeof options == 'undefined'){
        options = {};
    }
    if(typeof aliases[algorithm] !== 'undefined'){
        algorithm = aliases[algorithm];
    }
    if(typeof algorithms[algorithm] == 'undefined'){
        throw("exception unknown algorithm");
    }
    algo = algorithms[algorithm];
    return algo.hash(password, options);
}

function password_needs_rehash(hash, algorithm, options){
    var info = password_get_info(hash);
    if(typeof aliases[algorithm] !== 'undefined'){
        algorithm = aliases[algorithm];
    }
    if(typeof algorithms[algorithm] == 'undefined'){
        throw("exception unknown algorithm");
    }
    if(algorithms[algorithm].name == info.algoName){
        if(typeof options !== 'undefined' && typeof options.cost !== 'undefined'){
            if(info.options.cost != options.cost){
                return false;
            }
        }
        return true;
    }
    return false;
}

function password_verify(password, hash){
    var info = password_get_info(hash);
    return algorithms[info.algoName].verify(password, hash);
}

exports.password_get_info = password_get_info;
exports.password_hash = password_hash;
exports.password_needs_rehash = password_needs_rehash;
exports.password_verify = password_verify;