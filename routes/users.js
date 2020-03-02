const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const { authenticateUser, grantToken, verifyToken, revokeToken, sendUserMetaData } = require("../middleware/auth");

// Add a user
router.post("/register", async (req, res, next) => {

  // User object which we might save later.
  let user = req.body;

  try {

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      res.status(500).send("User with given email already exists!")
      console.warn(chalk.yellow('existing User ' + user.email + ' attempted to register again!'));
    }

    // If the user doesn't already exist
    else {

      let plainPassword = user.password;

      const encryptedPassword = await bcrypt.hash(plainPassword, 10);

      // Overwrite the plain password with the encrypted password.
      user.password = encryptedPassword;

      // Ensure that the 'verified' path exists AND is set to false. (Overwrites if someone attempted to send 'true')
      user.verified = false;

      // Ensure that the 'role' path exists AND is set to 'member'. (Overwrites if someone attempted to send something else)
      user.role = 'member';

      // Save the new user, and mongoose validators should handle the rest.
      await new User(user).save();

      res.status(201).send("User created/registered!");

      console.log(chalk.green('new User ' + user.email + ' has registered!'));

    }

  } catch (error) {
    next(error);
  }
});

// Send a verification email to a user
router.post("/send-verification-email", async (req, res, next) => {

  let email = req.body.email;

  /**As req.query’s shape is based on user-controlled input, all properties and values in this object are untrusted 
   and should be validated before trusting. For example, req.query.foo.toString() may fail in multiple ways, 
   for example foo may not be there or may not be a string, and toString may not be a function and instead 
   a string or other user-input. 
   
   https://expressjs.com/en/4x/api.html#req.query

   */

  if (typeof email === "string") {

    try {

      email = email.trim();

      // Check if a user with the provided email exists in the database
      let user = await User.findOne({ email });

      // Attempt to send the message if that user was found
      if (user) {

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

        console.log(chalk.green("Verification Email sent to " + email));
        res.send("Message has been sent!");

      }

      // If a user with the email was not found then end the connection.
      else {
        res.sendStatus(404);
        console.warn(chalk.yellow('Failed to send verification email. No such user ' + email));
      }

    }

    catch (err) {
      console.log(chalk.red('Failed to send verification email to ' + email))
      console.error(chalk.red(err.message));
      res.status(500).send("Something went wrong while sending the email!");
    }
  }

  // If no email has been provided
  else {
    res.sendStatus(400);
  }

});

// Verify a user account
router.post("/verify-account", async (req, res, next) => {

  let token = req.body.token;

  try {

    // If decoding succeeds we get back the payload which contains the user's email.
    let payload = jwt.verify(token, process.env.JWT_SECRET);

    let email = payload.email;

    // Find the user with that email
    let user = await User.findOne({ email });

    // Update the 'verified' path to true
    user.verified = true;
    await user.save();

    res.sendStatus(200);
    console.log(chalk.green('Account verified ' + email));

  }

  // If decoding the token fails
  catch (err) {
    res.sendStatus(500);
    console.error(chalk.red('Failed to verify a user account'));
    console.error(chalk.red(err.message));
  }

});

// Log a user in
router.post("/login", authenticateUser, grantToken, sendUserMetaData);


// Verify the user is logged in.
router.get("/login", verifyToken, sendUserMetaData);

// Log the user out
router.post("/logout", revokeToken);

// Get all users in the system
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// Get a single user by their ID.
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    }
    else {
      res.status(400).send('not found');
    }
  } catch (e) {
    next(e);
  }
});

// Update a single user by their ID.
router.patch("/:id", async (req, res, next) => {
  try {
    // try to find the document
    const user = await User.redactedFindById(req.params.id);
    if (user) {
      Object.assign(user, req.body);
      await user.save();
      res.status(201).send("updated");
    } else {
      res.status(400).send("user not found");
    }
  } catch (e) {
    next(e);
  }
});

// Delete a single user by their ID.
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
      res.send('deleted');
    }
    else {
      res.status(400).send('nothing deleted');
    }
  } catch (e) {
    next(e);
  }
});



module.exports = router;
