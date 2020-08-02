const json = require('../utils/dbJson');
const socketio = require('socket.io');
module.exports = function (app, server) {
    const io =  socketio.listen(server);
    const members = ["hai","ngo","chua","ngao","thuong"];
    io.on("connection",(socket)=>{
        console.log("co nguoi truy cap: "  + socket.id);
        //update id
        json.updateSocketID("haimtp",socket.id);

        // socket.join(room);
        // io.in(room).clients((err,clis) => {
        //     console.log(clis);
        // });

        //wait Gaem
        socket.on("waitGame",(username)=>{
            console.log(username);
            var roomID = json.findRoomPlace(username);
            console.log(roomID);
            socket.join(roomID);
        })
    })
   
   
}