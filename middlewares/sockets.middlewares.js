var socketio = require('socket.io');
module.exports = function (app, server) {
    const io =  socketio.listen(server);
    const room ="123456";
    const members = ["hai","ngo","chua","ngao","thuong"];
    io.on("connection",(socket)=>{
        console.log("co nguoi truy cap: "  + socket.id);
        //join to a room
        socket.join(room);
        io.in(room).clients((err,clis) => {
            console.log(clis);
        });
    })
   
   
}