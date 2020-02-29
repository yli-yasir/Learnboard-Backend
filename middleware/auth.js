const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies["tkn"], process.env.SECRET);
    next();
  } catch (e) {
    console.log(`JWT verification failure -> ${e.message} @ ${Date.now()}`);
    res.status(401).send("unauthorized");
  }
}

//attempt to log the user in
//if there is no user then respond with appropriate status code and message
//if the password in incorrect then do the same
//if both are correct the inject the plain version of the user document object
//under req.user and pass control to the next route
async function login(req, res, next) {
  try {
    console.log('Login attempt made...')

    const username = req.body.username.trim();
    const password = req.body.password;

    const user = await UserModel.findById(username)
    if (!user) {
      console.log(`Login attempt failed -> Invalid Username @ ${Date.now()}`)
      res.status(401).json({username: 'Invalid username'});
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(`Login attempt failed -> Invalid Password @ ${Date.now()}`);
      res.status(401).json({password: 'Invalid password'});
      return;
    }

    console.log(`Login attempt succeeded @ ${Date.now()}`);

    req.user = user.toJSON();

    next();

  } catch (e) {
    next(e);
  }
}

//req.user should be a plain object,it will be signed  and stored in cookie storage
//and finally respond with the username of the user that was successfully logged in.
function grantToken(req, res,next) {
  const token = jwt.sign(req.user, process.env.SECRET, {
    expiresIn: 60 * 30
  });
  res.cookie("tkn", token, {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true" ? true : false
  });

  console.log(
    'Granted token!');
}


function sendUserInfo(req,res,next){
    res.json({
        name:req.user.name
    })
}




module.exports = { verifyToken, login, grantToken,sendUserInfo };

