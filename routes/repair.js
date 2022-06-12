const express = require('express');
const db = require('../database');
const mongodb = require('mongodb');
const router = express.Router();
const ObjectId = mongodb.ObjectId;


router.get('/', async (req,res,next)=>{
    // DB에서 'repair' collection을 찾아 보여줌
    const repairs = await db.getDb().collection('repair')
    .find({}, {date:1, time:1, repairman:1,
        model:1, bought:1, reason:1, name:1}).toArray();

    // repairs-list.ejs
    res.render('repairs-list', {repairs:repairs});
}); // 예약 내역 보여주기(READ)(전체 예약 내역)


router.post('/select-repairman', async(req, res,next)=>{
    console.log(req.body.repairman);
    const man = req.body.repairman;
    const select_repairman = await db.getDb().collection('repair')
    .find({repairman: req.body.repairman}, 
        {date:1, time:1, repairman:1, model:1, bought:1, reason:1, 
            name:1, phone:1,adress:1} ).toArray();

    console.log(select_repairman);
    res.render('repairman-list', {select_repairman:select_repairman, man:man});
}); // ejs에서 선택한 수리기사 받기 



router.post('/', async (req,res,next)=>{
    console.log(req.body);
    const newRepair = {
        date : req.body.date,
        time: req.body.time,
        repairman : req.body.repairman,
        
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reason,
    
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
    }   
    const dd = req.body.date;
    const tt = req.body.time;
    const rr = req.body.repairman;
    const all = await db.getDb().collection('repair').find({},{}).toArray()
    if(!all || all.length === 0){ //첫 입력시 중복 예약 검증 X
        const result = await db.getDb().collection('repair').insertOne(newRepair);
        console.log(result);
        res.redirect('/repair');
    } else {
        const inDt = await db.getDb().collection('repair').findOne({date:dd, time:tt, repairman:rr},{date:1, time:1});
        if(inDt.date==dd && inDt.time==tt && inDt.repairman==rr){ // 날짜, 시간, 기사가 전부 같은 예약
            res.render('create-error'); // 예약하려는 내역과 같은 날짜, 시간, 기사님이 하나라도 있다면 예약 불가
        } else {
            const result = await db.getDb().collection('repair').insertOne(newRepair);
            console.log(result);
            res.redirect('/repair');
        }
    }
    const inDt = await db.getDb().collection('repair').findOne({date:dd, time:tt, repairman:rr},{date:1, time:1});
}); // 설치 및 수리 예약하기(CREATE)


router.get('/new', async (req,res,next)=>{
    // create-repair.ejs
    res.render('create-repair');
}); // 설치 및 수리 화면

router.get('/:id/phone-auth', async (req,res,next)=>{
    res.render('phone-auth', {id : req.params.id})
}); // 수정 시 전화번호 검증화면

router.post('/:id/phone-auth', async (req,res,next)=>{
    // id에 맞는 내역 검색
    const repair = await db.getDb().collection('repair')
    .findOne({_id: new ObjectId(req.params.id)},
    {date:1, time:1, repairman:1, model:1, bought:1, reason:1, 
        name:1, phone:1, address:1});    

    // 비밀번호가 일치했을 때
    if(repair.phone === req.body.phone){
        res.render('modify-repair',{repair:repair})
    }
    // 비밀번호가 다를 때
    res.render('phone-error') 
}); 

router.get('/:id/update', async (req,res,next)=>{
    res.render('modify-repair',{repair:req.params.id}) 
}); // 예약내역 수정하기(UPDATE)

router.post('/:id/update', async (req,res,next)=>{
    const result = await db.getDb().collection('repair')
    .updateOne({_id: new ObjectId(req.params.id)},
    { $set: {
        date : req.body.date,
        time: req.body.time,
        repairman : req.body.repairman,
    
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reason,

        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address
    }});
    console.log(result);
    res.redirect('/repair');
}); // 예약내역 수정하기(UPDATE)


router.get('/:id/delete', async (req,res,next)=>{
    const result = await db.getDb().collection('repair')
    .deleteOne({_id: new ObjectId(req.params.id)});
    console.log(result);
    res.redirect('/repair')
}); // 예약내역 삭제하기(DELETE)



module.exports = router;