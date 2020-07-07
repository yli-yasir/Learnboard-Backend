const nodemailer = require('nodemailer');
const prettyLogger = require('./prettyLogger');

class mailer{

  constructor(){
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      secure: true,
      auth: {
        user: senderEmail,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // recepientEmail - String
  // content - {subject : String, body: String}
  // HTML is supported in content.body
  // e.g. sendEmail("test@gmail.com",{subject: 'this is a test' , body: '<p>hello</p>.'});
  sendEmail(){
    const senderEmail = process.env.SMTP_USERNAME;
    try {
      await this.transporter.sendMail({
        from: `${process.env.APP_NAME} <${senderEmail}>`,
        to: recepientEmail,
        subject: content.subject,
        html: content.body,
});
      prettyLogger.logInfo(`Email sent to ${recepientEmail} successfully!`);
  }

  catch(err) {
    prettyLogger.logError(`Something went wrong while attempting to send an email to ${recepientEmail}.`);
  }

}
}

module.exports = mailer;