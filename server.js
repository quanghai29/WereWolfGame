//require module
const express = require('express');
const exphbs  = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');


//create app
const app = express();
//create server;
const server = require("http").Server(app);

//use module
app.use(express.static('public'));
app.use(express.static('config'));
app.use('/game',require('./routes/playGame.route'));

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

//render view
app.get("/",(req,res)=>{
    res.render("home");
})

//sockets
require('./middlewares/sockets.middlewares')(app,server);

//run server in port
const PORT = 3000;
server.listen(process.env.PORT || PORT,()=>{
  var addr = server.address();
  console.log('Express server listening on http://' + addr.address + ':' + addr.port);
});