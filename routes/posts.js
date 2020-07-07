const express = require("express");
const router = express.Router();
const Post = require("../db/models/post");
const jwt = require("jsonwebtoken");
const {verifyToken} = require('../middleware/auth')

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.search(
      req.query.q,
      req.query.type,
      req.query.author,
      req.query.start,
      10
    );
    res.json(posts);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {

  try {

    const post = await Post.findById(req.params.id);

    if (post) {
      res.json(post);
    
    }
    else {
      res.sendStatus(404);
    }

  } catch (e) {
    next(e);
  }
});

router.post('/',verifyToken, async (req, res, next) => {

  let post = req.body;

  let authorId = req.user.id;
  let authorName= req.user.name;

  try {
    post.author = {name: authorName,authorId}
    await new Post(post).save();
    res.sendStatus(201);
  }
  catch (e) {
    next(e)
  }
}

);

router.patch("/:id", async (req, res, next) => {

  const id = req.params.id;

  try {
    // Try to find the document
    const post = await Post.findById(id);
    if (post) {
      Object.assign(post, req.body);
      await post.save(req.body);
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", verifyToken, async (req, res, next) => {

  const id = req.params.id;

  try {
    const deletedDocument = await Post.findByIdAndDelete(id);
    if (deletedDocument) {
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  } catch (e) {
    next(e);
  }
});



module.exports = router;
