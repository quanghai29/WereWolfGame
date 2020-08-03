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

        //wait Game
        socket.on("waitGame",(username)=>{
            //var roomID = json.findRoomPlace(username);
            var roomID ="12345";
            socket.join(roomID);
            var members = json.getMemberInRoom(roomID);
            io.sockets.emit("list-members-in-room",members);
        })
    })
   
   
}