const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/',async (req,res,next)=>{
    try{
    const posts = await Post.find();
    res.json(posts);
    }
    catch(e){
        next(e)
    }
})

module.exports = router