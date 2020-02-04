const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const { verifyToken, login, grantToken, sendUserInfo } = require("../middleware/auth");

router.post("/register", async (req, res, next) => {

  try {

    //check if user with email already exists
    const existingUser = UserModel.find({email:req.body.email});

    if (existingUser){
      res.status(500).send("user with given email already exists")
      return;
    }
    
    const password = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      email: req.body.email,
      password
    };

    await new UserModel(newUser).save();

    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

//verify the JWT is valid, and send the username
router.get("/login", verifyToken, sendUserInfo);


//logs the user in
router.post("/login", login, grantToken, sendUserInfo);

//log the user out
router.post("/logout", function (req, res, next) {
  res.cookie("token", "", { expires: new Date() });
  res.end();
});

module.exports = router;
