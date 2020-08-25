//require necessary
const express = require('express');
const authRole =require('../middlewares/auth.mdw');
const router = express.Router();


//get.post

//wait room
router.get('/waitGame',authRole,(req,res,next)=>{
    res.render("waitGame")
});

module.exports = router;
