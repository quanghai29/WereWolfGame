//require module
const express = require('express');
const exphbs  = require('express-handlebars');

//create app
const app = express();
//create server;
const server =require("http").Server(app);

//use module

//set nescessary
app.set("views","./views");
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/layouts',
//   helpers: {
//     section: hbs_sections(),
//     format: val => numeral(val).format('0,0'),
//   }
}));
app.set('view engine', 'hbs');

//render view
app.get("/",(req,res)=>{
    res.render("index",{
        layout:false
    });
})

//run server in port
const PORT = 3000;
server.listen(process.env.PORT || PORT,()=>{
    console.log("Server is running at http://localhost:${PORT}");
});