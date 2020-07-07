const nodemailer = require('nodemailer');

function sendEmail(){}
// Sign a JWT with the user's email as the payload 
        let token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          secure: process.env.SECURE_SMTP === "true" ? true : false,
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
          }
        });

        // Send the email after putting the token in the verification link
        let info = await transporter.sendMail({
          from: 'Learnboard <Learnboard@gmail.com>',
          to: email,
          subject: 'Learnboard Account Verification',
          html: `<p>Hi ${user.name},</p><p>Please Click the following link to verify your email: <a href="${process.env.VERIFICATION_LINK}?vt=${token}">Verify my account</a></p>`
        });