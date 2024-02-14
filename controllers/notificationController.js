const Notification = require("../models/notification");
const Customer = require("../models/customer");
const Employee = require("../models/employee");
const Manager = require("../models/manager");
const Utils = require("../utils");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Create a new notification
exports.sendNotification = async (req, res) => {
  const notification = req.body;
  try {
    const newNotification = new Notification(notification);
    await newNotification.save();
    return { status: 201, message: "Notification sent" };
  } catch (error) {
    console.log(error);
  }
};

async function checkUserType(userId) {
    if(await Customer.findOne({ _id: new ObjectId(userId) }) != null){
      return 'Customer';
    }
    if(await Employee.findOne({ _id: new ObjectId(userId) }) != null){
      return 'Employee';
    }
    if(await Manager.findOne({ _id: new ObjectId(userId) }) != null){
        return 'Manager';
    }
}

// exports.getCustomerNotifications = async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const notifications = await Notification.find(
//             { 
//                 'recipient.id': { $in: [userId] }
//             }
//         )
//         .select('_id date content sender')
//         .sort({ date: -1 })
//         .exec();

//         for (const notification of notifications) {
//             const senderType = await checkUserType(notification.sender);
//             await Notification.populate(notifications, [{ path: 'sender', model: senderType }]);
//           }
//         res.json(notifications);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.getStatus = async (req, res) => {
    const { notificationId, userId } = req.body;
    try {
        const notification = await Notification.findOne({ _id: notificationId });
        for (const recipient of notification.recipient) {
            if(recipient.id == userId){
                return recipient.status;
            }
        }
    } catch (error) {
    }
}

exports.getNumberOfNew = async (req, res) => {
    const { userId } = req.body;
    let count = 0;
    try {
        const notifications = await Notification.find(
            { 
                'recipient.id': { $in: [userId] }
            }
        );
        for (const notification of notifications) {
            const notificationId = notification._id;
            const status = await this.getStatus({ body: {notificationId, userId}}, null);
            if(status == 0){
                count++;
            }
        }
        return count;
    } catch (error) {
    }
}

exports.getCustomerNotifications = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await Notification.aggregate([
            {
                $match: {
                    'recipient.id': { $in: [new ObjectId(userId)] }
                }
            },
            {
              $project: {
                _id: 1,
                date: 1,
                content: 1, 
                sender: 1,
                status: 2
              },
            },
            {
                $sort: { date: -1 }
            }
        ]);
        for (const notification of notifications) {
            const notificationId = notification._id;
            const senderType = await checkUserType(notification.sender);
            await Notification.populate(notifications, [{ path: 'sender', model: senderType }]);
            notification.status = await this.getStatus({ body: {notificationId, userId}}, null);
        }
        const numberOfNew = await this.getNumberOfNew({ body: {userId} }, null);
        res.json({ new: numberOfNew, notifications: notifications });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.markAsSeen = async (req, res) => {
    const notificationId = req.params.notificationId;
    const userId = req.params.userId;
    try {
        const notification = await Notification.findOne({ _id: notificationId });
        for (const recipient of notification.recipient) {
            if(recipient.id == userId){
                recipient.status = 2;
                await notification.save(); 
            }
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the employee' });
    }
}

exports.markAsRead = async (req, res) => {
    const notificationId = req.params.notificationId;
    const userId = req.params.userId;
    try {
        const notification = await Notification.findOne({ _id: notificationId });
        for (const recipient of notification.recipient) {
            if(recipient.id == userId){
                recipient.status = 1;
                await notification.save(); 
            }
        }
    } catch (error) {
    }
}

exports.markAllAsRead = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await Notification.find({'recipient.id': { $in: [(userId)] }});
        for (const notification of notifications) {
            await this.markAsRead({ params: { notificationId: notification._id, userId: userId } }, null);
        }
        res.json({ message: 'All notifications read' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the employee' });
    }
}