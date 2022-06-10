const express = require('express');
const db = require('../database');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


// 설치 및 수리 화면
async function newRepair(req, res,next) {
    // create-repair.ejs
    res.render('create-repair');
}
// 설치 및 수리 예약하기(CREATE)
async function createRepair(req, res,next) {
    console.log(req.body);
    const newRepair = {
        date : req.body.date,
        repairman : req.body.repairman,
        
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reson,
    
        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address,
    }    
    // DB에 예약내역 추가
    const result = await db.getDb().collection('repair').insertOne(newRepair);
    console.log(result);
    // 완료 후 repairs-list.ejs로 전환
    res.redirect('repairs-list');
}

// 예약 내역 보여주기(READ)
async function showRepairList(req, res,next) {
    // DB에서 'repair' collection을 찾아 보여줌
    const repairs = await db.getDb().collection('repair')
    .find({name:"김냄새"}, {date:1, repairman:1,
        model:1, bought:1, reason:1, name:1}).toArray();
    

    // repairs-list.ejs
    res.render('repairs-list', {repairs:repairs});
}

// 수정 시 비밀번호 검증화면
async function authRepair(req, res,next) {
    // user-auth.ejs
    res.render('user-auth', {id : req.params.id})
}
async function authPhoneRepair(req, res,next) { 
    const repair = await db.getDb().collection('repair')
    .findOne({_id: new ObjectId(req.params.id)},
    {date:1, repairman:1, model:1, bought:1, reason:1 , 
        name:1, phone:1, address:1,password:1});    

    if(repair.password === crypto.createHash('sha512').update(req.body.password).digest('base64')){
        res.render('modify-repair',{repair:repair})
    }
    // 비밀번호가 틀리면 password-error.ejs
    res.render('password-error') 
}


// 예약내역 수정하기(UPDATE)
async function updateRepair(req, res,next) {
    await db.getDb().collection('posts')
    .updateOne({_id: new ObjectId(req.params.id)},
    { $set: {
        date : req.body.date,
        repairman : req.body.repairman,
    
        model : req.body.model,
        bought : req.body.bought,
        reason : req.body.reson,

        name : req.body.name,
        phone : req.body.phone,
        address : req.body.address
    }});
res.redirect('/repair')
}

// 예약내역 삭제하기(DELETE)
async function deleteRepair(req, res,next) {
    await db.getDb().collection('repair')
    .deleteOne({_id: new ObjectId(req.params.id)});

    res.redirect('/repair')
}

module.exports={
    newRepair,
    authPhoneRepair,
    updateRepair,
    deleteRepair,
    authRepair,
    showRepairList,
    createRepair
}