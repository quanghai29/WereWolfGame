//require necessary
const express = require('express');

const router = express.Router();


//get.post

//wait room
router.get('/waitGame',(req,res,next)=>{
    res.render("waitGame",{
        user: res.locals.authUser
    });
})

module.exports = router;
