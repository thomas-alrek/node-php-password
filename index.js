var algorithms = require("./algorithms.json");
var hash_regex = /(\$\d+[a-zA-Z]+?\$)(\d+)\$([\.\/\da-zA-Z]+)/g;

function password_get_info(hash){
    var match = hash_regex.exec(hash);
    hash_regex.lastIndex = 0;
    var info = {
        algo: "",
        algoName: "",
        options: {
            cost: 0
        }
    };
    if(match == null){
        //throw exception
        return info;
    }
    if(typeof match[1] !== 'undefined' && typeof algorithms[match[1]] !== 'undefined'){
        info.algo = algorithms[match[1]].index;
        info.algoName = algorithms[match[1]].name;
    }else{
        //throw exception
    }
    if(typeof match[2] !== 'undefined'){
        info.options.cost = parseInt(match[2]);
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
    if(typeof options.cost == 'undefined'){
        options.cost = 10;
    }
    try{
        algo = require("./wrappers/" + algorithms[algorithm].name + ".js");
    }catch(e){
        //Wrapper for info.algoName doesn't exist
    }
    return algorithms[algorithm].id + options.cost + "$" + algo.hash(password, options);
}

function password_needs_rehash(hash, algorithm, options){
    var info = password_get_info(hash);
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
    var algo;
    try{
        algo = require("./wrappers/" + info.algoName + ".js");
    }catch(e){
        //Wrapper for info.algoName doesn't exist
    }
    return algo.verify(password, hash);
}

exports.password_get_info = password_get_info;
exports.password_hash = password_hash;
exports.password_needs_rehash = password_needs_rehash;
exports.password_verify = password_verify;