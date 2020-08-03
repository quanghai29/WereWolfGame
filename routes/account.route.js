//require necessary
const express = require('express');

const router = express.Router();


//get.post


//login
router.get('',(req,res,next)=>{
    res.render("login",{layout:false});
})

module.exports = router;