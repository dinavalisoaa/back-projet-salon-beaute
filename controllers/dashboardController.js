const utilController = require("./utilController");
const Appointment = require("../models/appointment");
const Expense = require("../models/expense");

// Temps moyen de travail pour chaque employé
exports.employeeAverageWorkingTime = async (req, res) => {
    try {
        const tasks = await Appointment.aggregate([
            {
                $match: {
                    status: 2
                },
            },
            {
                $lookup: {
                    from: "services", 
                    localField: "service",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $addFields: {
                    sumDuration: {
                        $sum: "$service.duration"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                        employee: "$employee"
                    },
                    total: { $sum: "$sumDuration" }
                }
            },
            {
                $group: {
                    _id: {
                        employee: "$_id.employee"
                    },
                    averageWorkingTime: { $avg: "$total" }
                }
            },
            {
                $project: {
                    employee: "$_id.employee",
                    averageWorkingTime: 1
                }
            },
            {
                $sort: { averageWorkingTime: -1 }
            },
        ]);
        await Appointment.populate(tasks, [{ path: "employee" }]);
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

// Nombre de reservation par jour (Liste des jours avec reservations)
exports.listOfReservationsPerDay = async (req, res) => {
    try {
        const reservations = await Appointment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                        employee: "$employee"
                    },
                    numberOfReservations: { $sum: 1 }
                }
            }
        ]);
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

//Liste complet de toutes les réservations
exports.listOfAllReservations = async (req, res) => {
    try {
        const reservations = await Appointment.find().populate('customer');
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}

// Nombre de reservation par jour (pour chaque jour)
exports.numberOfReservationsPerDay = async (req, res) => {
    const { date } = req.body;
    try {
        const reservations = await Appointment.aggregate([
            {
                $addFields: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  day: { $dayOfMonth: "$date" }
                }
            },
            {
                $match: {
                    year: Number(new Date(date).getFullYear()),
                    month: Number(new Date(date).getMonth() + 1),
                    day: Number(new Date(date).getDate())
                }
            }
        ]);
        res.json(reservations.length);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

// Nombre de reservation par jour (moyenne)
exports.averageNumberOfReservationsPerDay = async (req, res) => {
    try {
        const reservations = await Appointment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    numberOfReservations: { $sum: 1 } 
                },
            },
            {
                $group: {
                    _id: null,
                    averageNumberOfReservationsPerDay: { $avg: "$numberOfReservations" } 
                }
            }
        ]);
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

async function numberOfReservations(year, month) {
    try {
        const reservations = await Appointment.aggregate([
            {
                $addFields: {
                  year: { $year: "$date" },
                  month: { $month: "$date" }
                }
            },
            {
                $match: {
                    year: Number(year),
                    month: Number(month)
                }
            }
        ]);
        return reservations.length;
    } catch (error) {
        console.log(error);
    }
};

// Nombre de reservation par mois (pour chaque mois)
exports.numberOfReservationsPerMonth = async (req, res) => {
    const year = req.params.year;
    const months = utilController.getAllMonths();
    const statistics = [];
    try {
        for(const element of months){
            statistics.push({
                month: element,
                numberOfReservations: await numberOfReservations(year, element.monthNumber)
            })
        }
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}

// Chiffre d'affaires par jour (pour chaque jour)
exports.salesPerDay = async (req, res) => {
    const date = req.query.date;
    var sales = 0;
    try {
        var d = new Date(date);
        if(date == null){
            d = new Date();
        }
        const appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: "services", 
                    localField: "service",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $addFields: {
                    sumAmount: {
                        $sum: "$service.price"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    sales: { $sum: "$sumAmount" }
                }
            },
            {
                $match: {
                    '_id.year': Number(d.getFullYear()),
                    '_id.month': Number(d.getMonth() + 1),
                    '_id.day': Number(d.getDate())
                }
            }
        ]);
        if(appointments.length > 0){
            sales = appointments[0].sales;
        } 
        res.json(sales);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

// Chiffre d'affaires par jour (moyenne)
exports.averageSalesPerDay = async (req, res) => {
    var sales = 0;
    try {
        const appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: "services", 
                    localField: "service",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $addFields: {
                    sumAmount: {
                        $sum: "$service.price"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    sales: { $sum: "$sumAmount" }
                }
            },
            {
                $group: {
                    _id: null,
                    averageSalesPerDay: { $avg: "$sales" } 
                }
            }
        ]);
        sales = appointments[0].averageSalesPerDay;
        res.json(sales);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
};

async function salesAmount(year, month) {
    var sales = 0;
    try {
        const appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: "services", 
                    localField: "service",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $addFields: {
                    sumAmount: {
                        $sum: "$service.price"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    sales: { $sum: "$sumAmount" }
                }
            },
            {
                $match: {
                    '_id.year': Number(year),
                    '_id.month': Number(month)
                }
            }
        ]);
        if(appointments.length > 0){
            sales = appointments[0].sales;
        } 
        return sales;
    } catch (error) {
        console.log(error);
    }
};

// Chiffre d'affaires par mois (pour chaque mois)
exports.salesPerMonth = async (req, res) => {
    const year = req.params.year;
    const months = utilController.getAllMonths();
    const statistics = [];
    try {
        for(const element of months){
            console.log(await salesAmount(year, element.monthNumber));
            statistics.push({
                month: element,
                sales: await salesAmount(year, element.monthNumber)
            })
        }
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}

// Dépenses d'un mois
async function expensesAmount(year, month) {
    var expensesValue = 0;
    try {
        const expenses = await Expense.aggregate([
            {
                $addFields: {
                  year: { $year: "$date" },
                  month: { $month: "$date" }
                }
            },
            {
                $match: {
                    year: Number(year),
                    month: Number(month)
                }
            },
            {
                $project: {
                    expenses: { $sum: "$amount" }
                }
            }
        ]);
        if(expenses.length > 0){
            expensesValue = expenses[0].expenses;
        }
        return expensesValue;
    } catch (error) {
        console.log(error);
    }
};

async function profitsAmount(year, month) {
    try {
        const sales = await salesAmount(year, month);
        console.log("SALES: " + sales);
        const expenses = await expensesAmount(year, month);
        console.log("EXPENSES: " + expenses);
        return sales - expenses;
    } catch (error) {
        console.log(error);
    }
};

// Benefices par mois (en entrant les depenses)
exports.profitsPerMonth = async (req, res) => {
    const year = req.params.year;
    const months = utilController.getAllMonths();
    const statistics = [];
    try {
        for(const element of months){
            console.log(await profitsAmount(year, element.monthNumber));
            statistics.push({
                month: element,
                profits: await profitsAmount(year, element.monthNumber)
            })
        }
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}

//Bilan financier mensuel
exports.monthlyFinancialReview = async (req, res) => {
    const year = req.params.year;
    const months = utilController.getAllMonths();
    const statistics = [];
    try {
        for(const element of months){
            console.log(await profitsAmount(year, element.monthNumber));
            statistics.push({
                month: element,
                sales: await salesAmount(year, element.monthNumber),
                expenses: await expensesAmount(year, element.monthNumber),
                profits: await profitsAmount(year, element.monthNumber)
            })
        }
        res.json(statistics);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}

//Chiffre d'affaires total
async function totalSalesAmount() {
    var sales = 0;
    try {
        const appointments = await Appointment.aggregate([
            {
                $lookup: {
                    from: "services", 
                    localField: "service",
                    foreignField: "_id",
                    as: "service"
                }
            },
            {
                $addFields: {
                    sumAmount: {
                        $sum: "$service.price"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    sales: { $sum: "$sumAmount" }
                }
            }
        ]);
        if(appointments.length > 0){
            sales = appointments[0].sales;
        } 
        return sales;
    } catch (error) {
        console.log(error);
    }
};

async function totalExpensesAmount() {
    var expensesValue = 0;
    try {
        const expenses = await Expense.aggregate([
            {
                $project: {
                    expenses: { $sum: "$amount" }
                }
            }
        ]);
        if(expenses.length > 0){
            expensesValue = expenses[0].expenses;
        }
        return expensesValue;
    } catch (error) {
        console.log(error);
    }
};

async function totalProfitsAmount() {
    try {
        const sales = await totalSalesAmount();
        const expenses = await totalExpensesAmount();
        return sales - expenses;
    } catch (error) {
        console.log(error);
    }
};

exports.totalAmount = async (req, res) => {
    try {
        const sales = await totalSalesAmount();
        const expenses = await totalExpensesAmount();
        const profits = await totalProfitsAmount();
        res.json({
            sales: sales,
            expenses: expenses,
            profits: profits
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
}