exports.name = "PASSWORD_BCRYPT";

var BCrypt = require("bcryptjs");
var expression = /\$(2[a|x|y])\$(\d+)\$(.{53})/g;

function verify(password, hash){
    expression.lastIndex = 0;
    var match = expression.exec(hash);
    hash = "$2a$" + match[2] + "$" + match[3];
    return BCrypt.compareSync(password, hash);
}

function hash(password, options){
    expression.lastIndex = 0;
    if(typeof options == 'undefined'){
        options = {};
    }
    if(typeof options.cost == 'undefined'){
        options.cost = 10;
    }
    if(options.cost < 10){
        options.cost = 10;
    }
    var salt = BCrypt.genSaltSync(options.cost);
    var hash = BCrypt.hashSync(password, salt);
    var output = expression.exec(hash);
    return "$2y$" + options.cost + "$" + output[3];;
}

function cost(hash){
    expression.lastIndex = 0;
    var match = expression.exec(hash);
    if(typeof match[2] !== 'undefined'){
        return parseInt(match[2]);
    }
    return 0;
}

exports.expression = expression;
exports.verify = verify;
exports.cost = cost;
exports.hash = hash;