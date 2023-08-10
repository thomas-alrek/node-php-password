# node-php-password

*Verify password hashed generated in PHP, and hash passwords in the same format.*

Designed to be **future proof** for new hashing algorithms.

node-php-password is a solution for every kind of webapp which has a user database with passwords hashed with PHP's password_hash. Instead of starting from scratch, just use this package to get compatibility with PHP.

### Installation
```
npm install node-php-password
```

### Usage:
For JavaScript:
```javascript
var Password = require("node-php-password");

var pwdHash = Password.hash("password123");
// Password.hash(password, [algorithm], [options]);
```

For TypeScript
```typescript
import { hash } from "node-php-password";

const pwdHash = hash("password123");
// hash(password, [algorithm], [options]);
```
**Output:**
```javascript
"$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy"
```
*If algorithm isn't defined, **"PASSWORD_DEFAULT"** will be used*

*If no options is supplied, a **cryptographically secure** salt will be generated with the minimum recommended cost value.*

### To verify a password against an existing hash in a database o.l:
For JavaScript:
```javascript
var Password = require("node-php-password");
var pwdHash = "$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy";

if(Password.verify("password123", pwdHash)){
   //Authentication OK
}else{
   //Authentication FAILED
}
```
For TypeScript:
```typescript
import { verify } from "node-php-password";

const pwdHash = "$2y$10$8mNOnsos8qo4qHLcd32zrOg7gmyvfZ6/o9.2nsP/u6TRbrANdLREy";

if(verify("password123", pwdHash)){
   //Authentication OK
}else{
   //Authentication FAILED
}
```

### Options

For JavaScript
```javascript
var Password = require("node-php-password");
var options = {
   cost: 10,
   salt: "qwertyuiopasdfghjklzxc"
}
// Valid algorithms are "PASSWORD_DEFAULT", and "PASSWORD_BCRYPT"
// "PASSWORD_DEFAULT" is just an alias to "PASSWORD_BCRYPT", to be more
// compatible with PHP
var pwdHash = Password.hash("password123", "PASSWORD_DEFAULT", options);
```

For TypeScript
```typescript
impor { hash } from "node-php-password";

const options = {
   cost: 10,
   salt: "qwertyuiopasdfghjklzxc"
}
// Valid algorithms are "PASSWORD_DEFAULT", and "PASSWORD_BCRYPT"
// "PASSWORD_DEFAULT" is just an alias to "PASSWORD_BCRYPT", to be more
// compatible with PHP
const pwdHash = hash("password123", "PASSWORD_DEFAULT", options);
```

**Output:**
```javascript
"$2y$10$qwertyuiopasdfghjklzxO3U1f6PD/l04UrnxUgya51pjyLtkGNQi"
```

**WARNING** It is not recommended to generate a salt manually. The default salt that is generated is a tested, and proven cryptographically secure value. Use this option with care.
The cost value should be set to a value that makes the hashing take at least 50ms.

### Check if password needs rehash
If you have a mix of passwords hashed with different algorithms (md5, sha256, etc...), or with a different cost value, you can check if they comply with your password policy by checking if they need a rehash. If they do, you can prompt your user to update their password.

For JavaScript
```javascript
var Password = require("node-php-password");
var user_password = "password123";
var pwdHash = Password.hash(user_password, "PASSWORD_DEFAULT", {cost: 10});

if(Password.verify(user_password, pwdHash)){
   if(Password.needsRehash(pwdHash, "PASSWORD_DEFAULT", {cost: 11})){
      //Password needs to be rehashed
      pwdHash = Password.hash(user_password, "PASSWORD_DEFAULT", {cost: 11});
   }
}
```
For TypeScript
```typescript
import { hash, verify, needsRehash }"node-php-password";

const user_password = "password123";
let pwdHash = hash(user_password, "PASSWORD_DEFAULT", {cost: 10});

if(verify(user_password, hash)){
   if(needsRehash(hash, "PASSWORD_DEFAULT", {cost: 11})){
      //Password needs to be rehashed
      pwdHash = hash(user_password, "PASSWORD_DEFAULT", {cost: 11});
   }
}
```
