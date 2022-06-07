const express = require('express');
const db = require('../database');
const mongodb = require('mongodb');
const router = express.Router();
const crypto = require('crypto');
const ObjectId = mongodb.ObjectId;
const readline = require('readline');

router.get('/', async function(req,res){
    const posts = await db
    .getDb()
    .collection('posts')
    .find({},{ title:1,code:1,state:1,detail:1,price:1 })
    .toArray()
    res.render('posts-list',{posts:posts});
});


router.get('/new', async function(req,res){
    res.render('create-post');
});


router.post('/', async function(req,res){
    const newPost = {
        title : req.body.title,
        code : req.body.code,
        state : req.body.state,
        price : req.body.price,
        detail : req.body.detail,
        phone_number:req.body.phone_number,
        password : crypto.createHash('sha512').update(req.body.password).digest('base64'),
        date:new Date(),
    };
    const result =  await db.getDb().collection('posts').insertOne(newPost);
    console.log(result); 
    res.redirect('/posts');
});


router.get('/:id/buy',async function(req,res){
    const call = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{phone_number:1});

    res.send(`<script>confirm('판매자 연락처 : ${call.phone_number}')</script>`);
    //res.redirect('/posts');
})




router.get('/:id/user-auth',async function(req,res){
    res.render('user-auth',{id:req.params.id})
})

router.post('/:id/edit',async function(req,res){
    const post = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{title:1,code:1,state:1,detail:1,price:1});

    res.render('modify-post',{post:post})
})

router.post('/:id/delete',async function(req,res){
    res.send("<script>alert('삭제하기')</script>");
    //res.redirect('/posts');
    //res.write("<script>window.location=\"../view/notices\"</script>");
})





module.exports = router;