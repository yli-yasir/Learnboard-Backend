const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const { verifyToken, login, grantToken, sendUserInfo } = require("../middleware/auth");

// Add a user
router.post("/register", async (req, res, next) => {

  try {

    // Check if user with email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      res.status(500).send("User with given email already exists!")
      return;
    }


    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    req.body.password = encryptedPassword;

    // Save the new user
    await new User(req.body).save();

    res.status(201).send("User created/registered!");

  } catch (error) {
    next(error);
  }
});

// Verify the JWT is valid, and send some user info
router.get("/login", verifyToken, sendUserInfo);


// Log the user in, by authenticating and granting a token.
router.post("/login", login, grantToken, sendUserInfo);

// Log the user out
router.post("/logout", (req, res, next) => {
  res.cookie("tkn", "", { expires: new Date() });
  res.end();
});

router.post("/send-verification-email", async (req, res, next) => {

  // If an email has been provided.
  if (req.body.email){

  try {

    // Check if a user with the provided email exists in the database
    let email = req.body.email.trim();
    let user = await User.findOne({ email });

    // Attempt to send the message if that user was found.
    if (user) {

      let token = jwt.sign({ email },process.env.JWT_SECRET,{expiresIn: "1h"});
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        secure: process.env.SECURE_SMTP === "true" ? true : false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD
        }
      });

      let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email , // list of receivers
        subject: "Learnboard", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Click the following link to verify your email:</b> " + token // html body
      });
      
      console.log(chalk.green("Verification Email sent to " + email));
      res.send("Message has been sent!");

    }

    // If that user was not found then end the connection.
    else {
      res.status(404).end();
    }

  }

  catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong while sending the email!");
  }
  }

  // If no email has been provided
  else{
    res.status(400).end();
  }

});

router.post("/verify-email", (req, res, next) => {
  let decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
  res.send(decoded.email)
})
// Get all users in the system.
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
