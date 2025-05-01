const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sudharsanr.22cse@kongu.edu',
        pass: 'kydl iich qkak fqyb ',
    },
    secure: true,
    port: 465,
});


module.exports = transporter;