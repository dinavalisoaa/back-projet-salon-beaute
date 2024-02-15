const dateFns = require("date-fns");

function subtractDate(date, hours) {
    const newDate = dateFns.subHours(date, hours);
    return newDate;
};

function getAllMonths() {
    const monthsName = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    const abbreviations = [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Jui",
        "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
    ];
    const months = [];
    for(let i = 0; i < monthsName.length; i++){
        const monthNumber = i + 1;
        const monthName = monthsName[i];
        const abbreviation = abbreviations[i];
        months.push({monthNumber: monthNumber, monthName: monthName, abbreviation: abbreviation});
    }
    return months;
}

exports.subtractDate = subtractDate;
exports.getAllMonths = getAllMonths;