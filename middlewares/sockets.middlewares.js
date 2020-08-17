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
            var roomID = "12345";
            //var roomID = json.findRoomPlace(username);
            socket.join(roomID);
            var [members, actors] = json.getMemberInRoom(roomID);
            io.sockets.emit("list-members-in-room",members);

            //full place
            if(actors !=null){
                //get a array socketID of member in 'roomID'
                var socketIdMember = json.getSocketIdUsers(members);
                for(var i=0;i<socketIdMember.length;i++){
                    io.to(socketIdMember[i]).emit("actorOfYou",actors[i]);
                }
            }
        })
    })
   
   
}