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
function subtractDatePart(date, hours) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    // const datePart = {
    //     day: new Date(newDate).getDate(),
    //     month: new Date(newDate).getMonth() + 1,
    //     hour: new Date(newDate).getHours(),
    //     minute: new Date(newDate).getMinutes(),
    // };
    return new Date(new Date(newDate).getFullYear(),new Date(newDate).getMonth(),new Date(newDate).getDate(),new Date(newDate).getHours(),new Date(newDate).getMinutes());
  }
function getExpiration(){
    const now=new Date(subtractDatePart(new Date(),3));
    now.setHours(now.getHours()+1);
    return now;
}

exports.subtractDate = subtractDate;
exports.getAllMonths = getAllMonths;
exports.getExpiration = getExpiration;