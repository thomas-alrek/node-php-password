var BCrypt = require("bcryptjs");
var hash_regex = /(\$\d+[a-zA-Z]+?\$)(\d+)\$([\.\/\da-zA-Z]+)/g;

function verify(password, hash){
    var match = hash_regex.exec(hash);
    hash_regex.lastIndex = 0;
    hash = "$2a$" + match[2] + "$" + match[3];
    return BCrypt.compareSync(password, hash);
}

function hash(password, options){
    var cost = 10;
    if(typeof options !== 'undefined' && typeof options.cost !== 'undefined'){
        cost = options.cost;
    }
    var salt = BCrypt.genSaltSync(cost);
    var hash = BCrypt.hashSync(password, salt);
    var output = hash_regex.exec(hash);
    hash_regex.lastIndex = 0;
    hash = output[3];
    return hash;
}

exports.verify = verify;
exports.hash = hash;