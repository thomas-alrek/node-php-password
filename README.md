Hash and verify passwords hashed with PHP's built-in password_* functions

Designed to be future proof for new hashing algorithms.

Usage:

var Password = require("node-php-password");

var hash = Password.password_hash("password123", "PASSWORD_DEFAULT", { cost: 10 });
//hash: "$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy"

console.log(Password.password_verify("password123", hash);
//true

var hash = $1$7576f3a00f6de47b0c72c5baf2d505b0
console.log(Password.password_needs_rehash(hash, "PASSWORD_DEFAULT");
//true

WARNING password_needs_rehash is currently not working