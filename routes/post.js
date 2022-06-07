const express = require('express');
const db = require('../database');
const mongodb = require('mongodb');
const router = express.Router();
const crypto = require('crypto'); 
const ObjectId = mongodb.ObjectId;
const multer = require('multer');
const upload = multer({
    storage:  multer.diskStorage({ 
        destination: (req,file,cb)=>{ 
            cb(null, 'images');
        },
        filename: (req,file,cb)=>{ 
            cb(null, new Date().valueOf()+"."+file.mimetype.split('/')[1]);
        }
    }),
});

// 판매 글 목록 조회(READ)
router.get('/', async function(req,res){
    const posts = await db.getDb().collection('posts')
    .find({},{ title:1,code:1,state:1,detail:1,price:1,sale:1 }).toArray();  // db.posts.find

    res.render('posts-list',{posts:posts});
});


router.get('/new', async function(req,res){
    res.render('create-post');
});

// 판매 글 작성(CREATE)
router.post('/', upload.single('image') ,async function(req,res){
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
});

// 구매하기 버튼 클릭 (거래 완료 처리됨)
router.get('/:id/buy',async function(req,res){
    const call = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{title:1,phone_number:1});   // db.posts.find

    await db.getDb()
    .collection('posts')
    .updateOne({_id: new ObjectId(req.params.id)}, { $set: {sale: 1}, });  // db.posts.update

    res.render('call', {call:call});   
    //res.redirect('/posts');
})



// 수정 시 비밀번호 검증화면 get
router.get('/:id/user-auth',async function(req,res){
    res.render('user-auth',{id : req.params.id})
})

// 수정 시 비밀번호 검증
router.post('/:id/user-auth',async function(req,res){
    const post = await db
    .getDb()
    .collection('posts')
    .findOne({_id: new ObjectId(req.params.id)},{title:1,code:1,detail:1,price:1,image:1 ,password:1});    // db.posts.find

    if(post.password === crypto.createHash('sha512').update(req.body.password).digest('base64')){
        res.render('modify-post',{post:post})
    }
    res.render('password-error') // 틀리면 password-error 페이지 랜더링
})


// 판매글 수정(UPDATE)
router.post('/:id/edit',async function(req,res){
    await db.getDb()
    .collection('posts')
    .updateOne(
      {_id: new ObjectId(req.params.id)}, 
      {
        $set: {
          title: req.body.title,
          code: req.body.code,
          price: req.body.price,
          detail: req.body.detail,
          phone_number:req.body.phone_number
          //date: new Date()
        },
      }
    );
  res.redirect('/posts');
})

// 판매글 삭제(DELETE)
router.post('/:id/delete',async function(req,res){
    await db
      .getDb()
      .collection('posts')
      .deleteOne({_id: new ObjectId(req.params.id)});
    
    res.redirect('/posts');

});


module.exports = router;