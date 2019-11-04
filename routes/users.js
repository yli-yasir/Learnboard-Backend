const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {getErrorMessages}= require("../utils/mongoose");

router.get("/", async (req, res, next) => {
  try {
    //ONLY USE REDACTED FIND OR YOU RISK LEAKING EMAIL AND PASSWORD
    const users = await User.redactedFind();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
      //ONLY USE REDACTED FIND OR U RISK LEAKING EMAIL AND PASSWORD
    const user = await User.redactedFindById(req.params.id);
    if (user){
    res.json(user);
    }
    else{
        res.status(400).send('not found');
    }
  } catch (e) {
    next(e);
  }
});

router.post('/',async (req,res,next) => {
    try{
      await new User(req.body).save();
      res.send("created");
    }
    catch(e){
      const errorMessages = getErrorMessages(e);
      res.status(400).json(errorMessages);
    }
  }
    );
router.patch("/:id", async (req, res, next) => {
  try {
    // try to find the document
    const user = await User.redactedFindById(req.params.id);
    if (user) {
        Object.assign(user,req.body);
        await user.save();
      res.status(201).send("updated");
    } else {
      res.status(400).send("user not found");
    }
  } catch (e) {
    const errorMessages = getErrorMessages(e);
    console.log(errorMessages)
    res.status(400).json(errorMessages);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount ===1){
        res.send('deleted');
    }
    else{
        res.status(400).send('nothing deleted');
    }
  } catch (e) {
    next(e);
  }
});



module.exports = router;
