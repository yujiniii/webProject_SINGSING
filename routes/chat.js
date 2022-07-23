const express = require('express');
const router = express.Router();


router.get("/",(req,res)=>{
    res.render('chat-templates/chat');
});



module.exports = router;