const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskData = new mongoose.Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    status: Number
});

const Task = mongoose.model('Task', taskData);

module.exports = Task;