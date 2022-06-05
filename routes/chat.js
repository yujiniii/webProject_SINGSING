const express = require('express');
const router = express.Router();


router.get("/chat",(req,res)=>{
    res.sendFile('../views/chat.html');
});



module.exports = router;