/**
 * test 
 *
 * @package node-php-password
 * @copyright (c) 2016, Thomas Alrek
 * @author Thomas Alrek <thomas@alrek.no>
 */

var assert = require('assert');
var expect = require('chai').expect;
var Password = require("../index.js");
var package = require("../package.json");
var test_password = "password123";

describe('PHP-Password', function() {
    var test_hash = Password.hash(test_password, "PASSWORD_DEFAULT", {cost: 10});
    describe('constants', function () {
        it('"PASSWORD_DEFAULT" == "PASSWORD_BCRYPT"', function () {
            assert(package.aliases["PASSWORD_DEFAULT"] == "PASSWORD_BCRYPT", "'PASSWORD_DEFAULT' is not 'PASSWORD_BCRYPT'");
        });
    });
    describe('hash', function () {
        it('Hash is not equal to Password', function () {
            assert(test_hash !== test_password, 'Hash is equal to Password');
        });
        it("Hash starts with '$'", function () {
            assert(test_hash.charAt(0) == "$", "Hash doesn't starts with '$'");
        });
        it('Hash is 60 characters long', function () {
            assert(test_hash.length == 60, "Hash is not 60 characters long");
        });
    });
    describe('verify', function () {
        it('Verify hash against original password', function () {
            assert(Password.verify(test_password, test_hash), "Couldn't verify hash against original password");
        });
    });
    describe('getInfo', function () {
        var info = Password.getInfo(test_hash);
        it("Verify that hash has 'bcrypt' as algorithm", function () {
            assert(info.algoName == "PASSWORD_BCRYPT", "Hash doesn't have 'bcrypt' as algorithm");
        });
        it('Verify that hash has cost value of 10', function () {
            assert(info.options.cost == 10, "Couldn't verify that hash has cost value of 10");
        });
    });
    describe('needsRehash', function () {
        it("Verify that password doesn't needs rehash {cost: 10}", function () {
            assert(!Password.needsRehash(test_hash, "PASSWORD_DEFAULT", {cost: 10}), "Password needs rehash");
        });
        it("Verify that password needs rehash {cost: 11}", function () {
            assert(Password.needsRehash(test_hash, "PASSWORD_DEFAULT", {cost: 11}), "Password doesn't need rehash");
        });
    });
});
