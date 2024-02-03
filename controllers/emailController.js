const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

// Route pour envoyer un email
// app.post('/envoyer-email', (req, res) => {
exports.sendEmail = async (req, res) => {
    const { recipient, subject, message } = req.body;

    const mailOptions = {
        from: process.env.USER,
        to: recipient,
        subject: subject,
        text: message
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
    const { date, recipient, subject, message } = req.body;

    console.log("Fonction email");

    const envoiEmail = schedule.scheduleJob(date, () => {
        const mailOptions = {
            from: process.env.USER,
            to: recipient,
            subject: subject,
            text: message
        };

        console.log("Fonction email 2");

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                console.error('Erreur lors de l\'envoi de l\'email :', error);
            } else {
                console.log('E-mail envoyé: ' + info.response);
                console.log('Email envoyé avec succès :', info.response);
            }
        });
    });
};