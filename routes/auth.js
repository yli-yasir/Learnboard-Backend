const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const bcrypt = require('bcryptjs');
const { verifyToken, login, grantToken, sendUserInfo } = require("../middleware/auth");

router.post("/register", async (req, res, next) => {

  try {

    // Check if user with email already exists
    const existingUser = await UserModel.findOne({email:req.body.email});

    if (existingUser){
      res.status(500).send("User with given email already exists!")
      return;
    }
    

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    req.body.password = encryptedPassword;

    // Save the new user
    await new UserModel(req.body).save();

    res.status(201).send("User created/registered!");
    
  } catch (error) {
    next(error);
  }
});

//verify the JWT is valid, and send some user info
router.get("/login", verifyToken, sendUserInfo);


//logs the user in
router.post("/login", login, grantToken, sendUserInfo);

//log the user out
router.post("/logout", function (req, res, next) {
  res.cookie("tkn", "", { expires: new Date() });
  res.end();
});

module.exports = router;
