const express = require('express');
const db = require('../database');
const mongodb = require('mongodb');
const router = express.Router();
const ObjectId = mongodb.ObjectId;


// router.get('/', function(req,res){
//     res.render('404');
// });


router.get('/', async (req,res,next)=>{
    // DB에서 'repair' collection을 찾아 보여줌
    const repairs = await db.getDb().collection('repair')
    .find({}, {date:1, repairman:1,
        model:1, bought:1, reason:1, name:1}).toArray();

    // repairs-list.ejs
    res.render('repairs-list', {repairs:repairs});
}); // 예약 내역 보여주기(READ)(전체 예약 내역)

router.post('/select-repairman', async(req, res,next)=>{
    console.log(req.body.repairman);
    const select_repairman = await db.getDb().collection('repair')
    .find({repairman: req.body.repairman}, 
        {date:1, repairman:1, model:1, bought:1, reason:1, name:1, phone:1,adress:1} )
    .toArray();
    console.log(select_repairman);
    res.render('repairman-list', {select_repairman:select_repairman});
}); // ejs에서 선택한 수리기사 받기 


/*
router.get('/select-repairman', async(req, res, next) => {
    // DB에서 'repair' collection을 찾아 보여줌
    const select_repairman = await db.getDb().collection('repair')
    .find({repairmain: req.body.repairman}, {date:1, repairman:1,
        model:1, bought:1, reason:1, name:1}).toArray();

    // repairs-list.ejs
    res.render('repairman-list', {select_repairman:select_repairman});
});*/


router.post('/', async (req,res,next)=>{
    console.log(req.body);
    const newRepair = {
        date : req.body.date,
        repairman : req.body.repairman,
        
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reason,
    
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
    }    
    // DB에 예약내역 추가
    const result = await db.getDb().collection('repair').insertOne(newRepair);
    console.log(result);
    res.redirect('/repair');
}); // 설치 및 수리 예약하기(CREATE)

router.get('/new', async (req,res,next)=>{
    // create-repair.ejs
    res.render('create-repair');
}); // 설치 및 수리 화면


router.get('/:id/phone-auth', async (req,res,next)=>{
    res.render('phone-auth', {id : req.params.id})
}); // 수정 시 전화번호 검증화면


router.post('/:id/phone-auth', async (req,res,next)=>{
    const repair = await db.getDb().collection('repair')
    .findOne({_id: new ObjectId(req.params.id)},
    {date:1, repairman:1, model:1, bought:1, reason:1, 
        name:1, phone:1, address:1});    

    if(repair.phone === req.body.phone){
        res.render('modify-repair',{repair:repair})
    }
    // 비밀번호가 틀리면 phone-error.ejs
    res.render('phone-error') 
}); 

router.get('/:id/update', async (req,res,next)=>{
    res.render('modify-repair',{repair:req.params.id}) 
}); // 예약내역 수정하기(UPDATE)

router.post('/:id/update', async (req,res,next)=>{
    await db.getDb().collection('repair')
    .updateOne({_id: new ObjectId(req.params.id)},
    { $set: {
        date : req.body.date,
        repairman : req.body.repairman,
    
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reason,

        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address
    }});
    res.redirect('/repair')
}); // 예약내역 수정하기(UPDATE)


router.get('/:id/delete', async (req,res,next)=>{
    await db.getDb().collection('repair')
    .deleteOne({_id: new ObjectId(req.params.id)});

    res.redirect('/repair')
}); // 예약내역 삭제하기(DELETE)



module.exports = router;