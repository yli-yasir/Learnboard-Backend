const UserModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");

// Authenticate the user
async function authenticateUser(req, res, next) {
  let email = req.body.email;
  const password = req.body.password;

  // If a username and password are defined and are of type string.
  if (typeof email === "string" && typeof password === "string"){

    try {

      email = email.trim();

      // Try to find the user.
      // Password path is selected explicitly as it's set to false by default and will be needed to compare passwords.
      const existingUser = await UserModel.findOne({email},'_id name password');
  
      // If there is no user then respond with appropriate status code
      if (!existingUser) {
        res.sendStatus(404);
        console.warn(chalk.yellow(`User ${email} authentication attempt failed - no such user `));
      }

      // If a user was found, then compare the passwords.
      else{
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
        
      // If the password does not match
      if (!passwordMatch) {
        console.error(chalk.red(`User ${email} authentication attempt failed - Invalid Password`));
        res.sendStatus(401);
      }
      
      // If the password matches
      else{

        console.log(chalk.green(`User authentication attempt succeeded ${email}`));

        // Pass control to the next route after injecting a user object in req
        req.user = {id: existingUser.id , name : existingUser.name}
        next();
      }
    
    }

    } 

    catch (err) {
      console.error(chalk.red(err));
      res.sendStatus(400);
    }

  }

}

// Grant a token to a user
function grantToken(req, res,next) {

  // Generate a token
  const token = jwt.sign({id: req.user.id}, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Set a cookie in the response with the token
  res.cookie("tkn", token, {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true" ? true : false
  });

  // Pass control to the next route
  next();

}

// Verify that the token is valid
function verifyToken(req, res, next) {
  try {
    req.user = jwt.verify(req.cookies["tkn"], process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error(chalk.red(err));
    res.sendStatus(401);
  }
}

// Revoke a token
function revokeToken(req,res,next){
  res.clearCookie("tkn", {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === "true" ? true : false
  });
  res.end();
}

// Send back some user metadata.
function sendUserMetaData(req,res,next){
  res.json({
      name:req.user.name
  });
}











module.exports = { verifyToken, authenticateUser, grantToken,revokeToken,sendUserMetaData };

