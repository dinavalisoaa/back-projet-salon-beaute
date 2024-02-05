const crypto = require('crypto');

function encryptPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

function isValidEmail(email) {
    const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return emailRegex.test(email);
}

function convertMinutesToHoursAndMinutes(totalMinutes) {
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
  
    return {hours, minutes};
}

module.exports = {
    encryptPassword,
    isValidEmail,
    convertMinutesToHoursAndMinutes
};