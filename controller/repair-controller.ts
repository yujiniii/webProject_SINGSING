const db = require('../database');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


const getAllRepair = async (req,res,next)=>{
    // DB에서 'repair' collection을 찾아 보여줌
    const repairs = await db.getDb().collection('repair')
    .find({}, {date:1, time:1, repairman:1,
        model:1, bought:1, reason:1, name:1}).toArray();

    // repairs-list.ejs
    res.render('repair-templates/repairs-list', {repairs:repairs});
}

const postRepairmanSchedule = async(req, res,next)=>{
    console.log(req.body.repairman);
    const man = req.body.repairman;
    const select_repairman = await db.getDb().collection('repair')
    .find({repairman: req.body.repairman}, 
        {date:1, time:1, repairman:1, model:1, bought:1, reason:1, 
            name:1, phone:1,adress:1} ).toArray();

    console.log(select_repairman);
    res.render('repair-templates/repairman-list', {select_repairman:select_repairman, man:man});
}

const postRepairReservation = async (req,res,next)=>{
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
        const inDt = await db.getDb().collection('repair')
        .findOne({date:dd, time:tt, repairman:rr},{date:1, time:1, repairman:1});
        console.log(inDt);
        if(inDt == null) { // 중복된 내역이 없어 null값이 나온다면 예약 O
            const result = await db.getDb().collection('repair').insertOne(newRepair);
            console.log(result);
            res.redirect('/repair');
        } else if (inDt.date==dd && inDt.time==tt && inDt.repairman==rr ){ // 날짜, 시간, 기사가 전부 같은 예약
            res.render('error-templates/create-error'); // 예약하려는 내역과 같은 날짜, 시간, 기사님이 하나라도 있다면 예약 X            
        } 
        
    }
}

const getNewRepairPage = async (req,res,next)=>{
    // create-repair.ejs
    res.render('repair-templates/create-repair');
}

const getPhoneValidate = async (req,res,next)=>{
    res.render('repair-templates/phone-auth', {id : req.params.id})
}

const postPhoneValidate = async (req,res,next)=>{
    // id에 맞는 내역 검색
    const repair = await db.getDb().collection('repair')
    .findOne({_id: new ObjectId(req.params.id)},
    {date:1, time:1, repairman:1, model:1, bought:1, reason:1, 
        name:1, phone:1, address:1});    

    // 전화번호가 일치했을 때
    if(repair.phone === req.body.phone){
        res.render('repair-templates/modify-repair',{repair:repair})
    } else {
        // 전화번호가 다를 때
        res.render('error-templates/phone-error') 
    }
}

const getRepairEditPage = async (req,res,next)=>{
    res.render('repair-templates/modify-repair',{repair:req.params.id}) 
}

const postRepairEditPage  = async (req,res,next)=>{
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
}

const getDelete = async (req,res,next)=>{
    const result = await db.getDb().collection('repair')
    .deleteOne({_id: new ObjectId(req.params.id)});
    console.log(result);
    res.redirect('/repair')
}

module.exports = {
    getAllRepair,
    getDelete,
    getNewRepairPage,
    getPhoneValidate,
    getRepairEditPage,
    postPhoneValidate,
    postRepairEditPage,
    postRepairReservation,
    postRepairmanSchedule
}