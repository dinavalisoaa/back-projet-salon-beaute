const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const cron = require('node-cron');
const handlebars = require('handlebars');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// exports.sendEmail = async (req, res) => {
//     const { shipper, recipient, subject, message } = req.body;

//     const mailOptions = {
//         from: shipper + ' <' + process.env.USER + '>',
//         to: recipient,
//         subject: subject,
//         text: message
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error(error);
//             res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
//         } else {
//             console.log('E-mail envoyé: ' + info.response);
//             res.status(200).send('E-mail envoyé avec succès');
//         }
//     });
// };

exports.sendEmail = async (req, res) => {
    const { shipper, recipient, subject, customer, datetime } = req.body;

    const template = handlebars.compile(fs.readFileSync('templates/appointmentReminder.handlebars', 'utf8'));

    const html = template({ customer, datetime });

    const mailOptions = {
        from: shipper + ' <' + process.env.USER + '>',
        to: recipient,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
        } else {
            console.log('E-mail envoyé: ' + info.response);
            res.status(200).send('E-mail envoyé avec succès');
        }
    });
};

exports.sendScheduledEmail = async (req, res) => {
    const { date, shipper, recipient, subject, customer, datetime } = req.body;
    cron.schedule(`${date.minute} ${date.hour} ${date.day} ${date.month} *`, () => {
        this.sendEmail({body: {shipper, recipient, subject, customer, datetime}});
    });
};