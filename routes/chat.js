const express = require('express');
const { render } = require('express/lib/response');
const router = express.Router();


router.get("/",(req,res)=>{
    //res.sendFile('../views/chat.html');
    res.render('chat')
});



module.exports = router;