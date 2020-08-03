//require necessary
const express = require('express');

const router = express.Router();


//get.post


//login
router.get('/login',(req,res,next)=>{
    res.render("login",{layout:false});
})

//sign up
router.get('/signup',(req,res,next)=>{
    res.render("signup",{layout:false});
})

module.exports = router;