const transporter = require('../config/mailer');

module.exports.sendEmail = async function ({ to, subject, text ,html}) {
  let mailOptions = {
    from: 'sudharsanr.22cse@kongu.edu',
    to: to,
    subject: subject,
    text: text,
    html:html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};
