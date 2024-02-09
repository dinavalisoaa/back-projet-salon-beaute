const dateFns = require("date-fns");

function subtractDate(date, hours) {
    const newDate = dateFns.subHours(date, hours);
    return newDate;
};

exports.subtractDate = subtractDate;