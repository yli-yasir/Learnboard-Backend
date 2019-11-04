const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const {getErrorMessages}= require("../utils/mongoose");

router.get("/", async (req, res, next) => {
  console.log(req.query.q);
  try {
    const posts = await Post.search(
      req.query.q,
      req.query.type,
      req.query.author,
      req.query.start   
    );
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post){
    res.json(post);
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
    await new Post(req.body).save();
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
    const post = await Post.findById(req.params.id);
    if (post) {
      Object.assign(post,req.body);
      await post.save(req.body);
      res.status(201).send("updated");
    } else {
      res.status(400).send("not found");
    }
  } catch (e) {
    const errorMessages = getErrorMessages(e);
    res.status(400).json(errorMessages);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
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
