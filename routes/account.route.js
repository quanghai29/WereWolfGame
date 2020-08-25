//require necessary
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const userModel = require('../models/user.model');
const authRole = require('../middlewares/auth.mdw');
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

//Login
router.get('/login', async (req, res) => {
    res.render('login',{
      layout:false
    });
});
  
  router.post('/login', async (req, res) => {
    const user = await userModel.singleByUsername(req.body.username);
    if (user === null)
      return res.render('login', {
        layout: false,
        err_message: 'Login failed'
      });
  
    const rs = bcrypt.compareSync(req.body.password, user.password);
    if (rs === false)
      return res.render('login', {
        layout: false,
        err_message: 'Login failed'
      });
    
    req.session.username = req.body.username;  
    const url = req.query.retUrl || '/';
    res.redirect(url);
  })
  
  
  router.post('/logout', (req, res) => {
    req.session.username = false;
    res.redirect('/account/login');
  });

//Sign up
router.get('/signup', async (req, res) => {
    res.render('signup',{
      layout:false
    });
  });
  
  
  router.post('/signup', async (req, res) => {
    //Kiểm tra username duy nhất
    const user = await userModel.singleByUsername(req.body.username);
    if (user !== null)
    return res.render('signup', {
      layout: false,
      err_message: 'Tên đăng nhập đã tồn tại'
    });

    if(req.body.password_confirmation != req.body.password)
        return res.render('signup',{
            layout: false,
            err_message: 'Xác nhận mật khẩu không chính xác'
        });
  
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);

    delete req.body.password_confirmation;
    const entity = req.body;
    entity.password = hash;
    
    const result = await userModel.add(entity);
    console.log(result);
  
    res.redirect('/account/login');
  });

module.exports = router;