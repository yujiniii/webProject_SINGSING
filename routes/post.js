const express = require('express');
const db = require('../database');
const router = express.Router();


router.get('/', function(req,res){
    res.redirect('/posts');
});

router.get('/posts', async function(req,res){
    const posts = await db
    .getDb()
    .collection('posts')
    .find({},{ title:1,code:1,state:1,detail:1,price:1 })
    .toArray()
    res.render('posts-list',{posts:posts});
});


router.get('/new-post', async function(req,res){
    res.render('create-post');
});


router.post('/posts', async function(req,res){
    const newPost = {
        title : req.body.title,
        code : req.body.code,
        state : req.body.state,
        price : req.body.price,
        detail : req.body.detail,
        date:new Date(),
    };
    const result =  await db.getDb().collection('posts').insertOne(newPost);
    console.log(result); 
    res.redirect('/posts');
});


router.get('/posts/:id/buy',async function(req,res){
    res.send("<script>alert('구매하기')</script>");
    //res.redirect('/posts');
    //res.write("<script>window.location=\"../view/notices\"</script>");
})

router.get('/posts/:id/edit',async function(req,res){
    res.send("<script>alert('수정하기')</script>");
    //res.redirect('/posts');
    //res.write("<script>window.location=\"../view/notices\"</script>");
})

router.post('/posts/:id/delete',async function(req,res){
    res.send("<script>alert('삭제하기')</script>");
    //res.redirect('/posts');
    //res.write("<script>window.location=\"../view/notices\"</script>");
})





module.exports = router;