const crypto = require('crypto');

function encryptPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

module.exports = {
    encryptPassword
};