const express = require("express");
const router = express.Router();
const { verifyToken, login, grantToken,sendUserInfo } = require("../middleware/auth");

router.post("/register", async (req, res, next) => {
  try {

    const password = await bcrypt.hash(req.body.password, 10);

    const document = {
email: req.body.email,
password
    }
    await new UserModel(document).save();
    res.status(201).send("resource created");
  } catch (error) {
    next(error);
  }
});

//verify the JWT is valid, and send the username
router.get("/login", verifyToken, sendUserInfo);


//logs the user in
router.post("/login", login, grantToken,sendUserInfo);

//log the user out
router.post("/logout", function(req, res, next) {
  res.cookie("token", "", { expires: new Date() });
  res.end();
});

module.exports = router;
