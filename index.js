/**
 * node-php-password 
 *
 * @package node-php-password
 * @copyright (c) 2016, Thomas Alrek
 * @author Thomas Alrek <thomas@alrek.no>
 */

var glob = require("glob");
var path = require('path');
var aliases = require("./package.json").aliases;

/* hold all algorithm modules */
var algorithms = {};

/* load algorithm modules */
glob.sync(path.resolve(__dirname+'/algorithms/*.js')).forEach(function (file) {
    try{
        var algorithm = require(path.resolve(file));
        
        /* verify loaded module */
        if(typeof(algorithm.name) !== 'string'){
            throw("Invalid module: Module has an invalid name");
        }
        if(typeof algorithms[algorithm.name] !== 'undefined'){
            throw("Invalid module: Multiple module instances with name '" + algorithm.name + "'");
        }
        algorithms[algorithm.name] = algorithm;
        if(!(algorithms[algorithm.name].expression instanceof RegExp)){
            throw("Invalid module: Module has an invalid expression");
        }
        if(typeof algorithms[algorithm.name].verify !== 'function'){
            throw("Invalid module: Module verify() is not a valid function");
        }
        if(typeof algorithms[algorithm.name].cost !== 'function'){
            throw("Invalid module: Module cost() is not a valid function");
        }
        if(typeof algorithms[algorithm.name].hash !== 'function'){
            throw("Invalid module: Module hash() is not a valid function");
        }
    }catch(e){
        throw("Invalid module");
    }
});

/* check if any modules where loaded, otherwise throw error */
if(algorithms.length == 0){
    throw("exception no algorithms loaded");
}

/**
 * Get information from password hash
 * @param {string} hash A password hash to check
 * @return {object} Info object
 * @throws {Exception} Will throw an exception if unable to parse hash
 */
function getInfo(hash){
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

/**
 * Hash a password string
 * @param {string} password The plaintext password to hash
 * @param {string} algorithm Algorithm name, e.g "PASSWORD_DEFAULT"
 * @param {object} options Options to pass to the hashing algorithm
 * @return {string} Password hash
 * @throws {Exception} Will throw an exception if an invalid algorithm is passed
 */
function hash(password, algorithm, options){
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

/**
 * Check if a given password needs to be rehashed
 * @param {string} hash A password hash to check
 * @param {string} algorithm Algorithm name, e.g "PASSWORD_DEFAULT"
 * @param {object} options Options to pass to the hashing algorithm
 * @return {bool} true if password needs rehash, otherwise false
 * @throws {Exception} Will throw an exception if an invalid algorithm is passed
 */
function needsRehash(hash, algorithm, options){
    var info = {};
    try{
        info = getInfo(hash);
    }catch(e){
        /* unable to parse hash, so we assume it's an old or unknown format */
        return true;
    }
    /* check if the supplied algorithm name is an alias */
    if(typeof aliases[algorithm] !== 'undefined'){
        algorithm = aliases[algorithm];
    }
    /* unable to compare, because an invalid algorithm was supplied */
    if(typeof algorithms[algorithm] == 'undefined'){
        throw("exception unknown algorithm");
    }
    if(algorithms[algorithm].name == info.algoName){
        if(typeof options !== 'undefined' && typeof options.cost !== 'undefined'){
            if(info.options.cost < options.cost){
                return true;
            }
        }
        return false;
    }
    return true;
}

/**
 * Verify a plaintext password against hash
 * @param {string} password The plaintext password to check
 * @param {string} hash A password hash to check
 * @return {bool} true if password is verified against given hash, otherwise false
 * @throws {Exception} Will throw an exception if unable to parse hash
 */
function verify(password, hash){
    var info = getInfo(hash);
    return algorithms[info.algoName].verify(password, hash);
}

exports.getInfo = getInfo;
exports.hash = hash;
exports.needsRehash = needsRehash;
exports.verify = verify;
