const express = require('express');
const db = require('../database');
const router = express.Router();


router.get('/', function(req,res){
    res.redirect('/posts');
});

router.get('/posts', async function(req,res){
    const posts = db.getDb().collection('post').find().toArray()
    res.render('posts-list',{posts:posts});
});


router.post('/update-posts', async function(req,res){
    const authorId = new ObjectId(req.body.author);
    const newPost = {
        title : req.body.title,
        summary:req.body.summary,
        body : req.body.content,
        date:new Date(),
    };
    const result =  await db.getDb().collection('posts').updateOne({_id:authorId}, newPost);
    console.log(result);
    res.redirect('/posts');
});


router.get('/new-post', async function(req,res){
    res.render('create-post');
});

router.post('/create-posts', async function(req,res){
    const newPost = {
        title : req.body.title,
        summary:req.body.summary,
        body : req.body.content,
        date:new Date(),
        status : req.body.content
    };
    const result =  await db.getDb().collection('posts').insertOne(newPost);
    console.log(result);
    res.redirect('/posts');
});

router.get('/post-detail/:id',async function(req,res){
    const id = new ObjectId(req.params.id);
    const post =  await db.getDb().collection('authors').findOne({_id:id});

    res.render('post-detail',{post:post});
})




module.exports = router;