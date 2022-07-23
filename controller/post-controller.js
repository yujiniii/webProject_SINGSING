const db = require('../database');
const mongodb = require('mongodb');
const crypto = require('crypto');  // 암호화 관련 부분
const ObjectId = mongodb.ObjectId;

async function getAllPost(req,res){
    const posts = await db.getDb().collection('posts')
    .find({},{ title:1,code:1,state:1,detail:1,price:1,sale:1 }).toArray();  // db.posts.find

    res.render('post-templates/posts-list',{posts:posts});
}

async function getWritePage(req,res){
    res.render('post-templates/create-post');
}

async function postPostPage(req,res){
    let img = req.file; 
        console.log("req.file : ",img)

        if (img == undefined) {
            return res.status(500).send({ message: "undefined image file(no req.file) "});
        }
        const type = req.file.mimetype.split('/')[1];
        if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') {
            return res.status(500).send({ message: "Unsupported file type"});
    }
    const newPost = {
        title : req.body.title,
        code : req.body.code,
        state : req.body.state,
        price : req.body.price,
        detail : req.body.detail,
        phone_number:req.body.phone_number,
        image : img.path,
        password : crypto.createHash('sha512').update(req.body.password).digest('base64'),  //password 암호화
        sale:0,
        date:new Date(),
    };
    const result =  await db.getDb().collection('posts').insertOne(newPost);  // db.posts.insert
    console.log(result); 
    res.redirect('/posts');
}

async function getBuyPage(req,res){
    const call = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{title:1,phone_number:1});   // db.posts.find

    await db.getDb()
    .collection('posts')
    .updateOne({_id: new ObjectId(req.params.id)}, { $set: {sale: 1}, });  // db.posts.update, 구매 처리

    res.render('post-templates/call', {call:call});   
    //res.redirect('/posts');
}

async function getEditValidate(req,res){
    res.render('post-templates/user-auth',{id : req.params.id})
}

async function postEditValidate(req,res){
    const post = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{title:1,code:1,detail:1,state:1,price:1,image:1 ,password:1,phone_number:1});    // db.posts.find

    if(post.password === crypto.createHash('sha512').update(req.body.password).digest('base64')){ // 암호화로 비교
        res.render('modify-post',{post:post})
    } else {res.render('error-templates/password-error') // 틀리면 password-error 페이지 랜더링
    }
}

async function postEditPage(req,res){
    await db.getDb()
    .collection('posts')
    .updateOne(
      {_id: new ObjectId(req.params.id)}, 
      {
        $set: {
          title: req.body.title,
          code: req.body.code,
          state : req.body.state,
          price: req.body.price,
          detail: req.body.detail,
          phone_number:req.body.phone_number
        },
    }); // db.posts.update
res.redirect('/posts');
}

async function postDelete(req,res){
    await db
      .getDb()
      .collection('posts')
      .deleteOne({_id: new ObjectId(req.params.id)});
    
    res.redirect('/posts');

}

module.exports = {
    getAllPost,
    getBuyPage,
    getEditValidate,
    getWritePage,
    postDelete,
    postEditPage,
    postEditValidate,
    postPostPage}