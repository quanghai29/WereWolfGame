//require module
const express = require('express');
const exphbs  = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const session = require('express-session');

//create app
const app = express();
//create server;
const server = require("http").Server(app);


//use module
app.use(express.static('public'));
app.use(express.static('config'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

//set nescessary
app.set("views","./views");
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/layouts',
  helpers: {
    section: hbs_sections(),
    //format: val => numeral(val).format('0,0'),
  }
}));
app.set('view engine', 'hbs');

require('./middlewares/locals.mdw')(app,server);
require('./middlewares/sockets.middlewares')(app,server);
app.use('/account',require('./routes/account.route'));
app.use('/game',require('./routes/playGame.route'));


//render view
app.get("/",(req,res)=>{
  res.render("home");
})

//run server in port
const PORT = 3000;
server.listen(process.env.PORT || PORT,()=>{
  var addr = server.address();
  console.log('Express server listening on http://' + addr.address + ':' + addr.port);
});