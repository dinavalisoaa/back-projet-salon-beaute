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

function addMinutesToDate(date, minutes) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
}

function subtractDate(date, hours) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
}

function jsDate(date) {
    return subtractDate(date, 3);
}

module.exports = {
    encryptPassword,
    isValidEmail,
    convertMinutesToHoursAndMinutes,
    addMinutesToDate,
    jsDate
};