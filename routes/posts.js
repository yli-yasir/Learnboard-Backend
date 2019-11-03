const express = require('express');
const router = express.Router();
const Post = require('../models/post');

router.get('/',async (req,res,next)=>{
    console.log(req.query.q)
    try{
    const posts = await Post.search(
        req.query.q,
        req.query.type,
        req.query.author,
        req.query.start
    )
    res.json(posts);
    }
    catch(e){
        next(e)
    }
});

router.get('/:id',async (req,res,next)=>{
    try{
    const post = await Post.find({_id:req.params.id})
    res.json(post);
    }
    catch(e){
        next(e)
    }
});

module.exports = router