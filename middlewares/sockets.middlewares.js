const json = require('../utils/dbJson');
const socketio = require('socket.io');
module.exports = function (app, server) {
    const io =  socketio.listen(server);
    io.on("connection",(socket)=>{
        console.log("co nguoi truy cap: "  + socket.id);
        //update id
        socket.on("username",(username)=>{
            socket.username = username;
            //console.log("required: " + username);
            json.updateSocketID(username,socket.id);
        })
       
        
        // socket.join(room);
        // io.in(room).clients((err,clis) => {
        //     console.log(clis);
        // });

        //wait Game
        //Input room = ["username", "type"]
        socket.on("waitGame",(room)=>{
            console.log(room)
            //JOIN user to a room
            var roomID = json.findRoomPlace(room[0], room[1]);
            console.log(roomID);
            socket.join(roomID);

            // receive member in room, an randoom actors 
            // mebers = []
            // actors = [] if fullplace else actors = null 
            var [members, actors] = json.getMemberInRoom(roomID);

            //send list members in room for all user on room
            io.sockets.emit("list-members-in-room",members);

            //already play
            if(actors !=null){
                //get a array socketID of member in 'roomID'
                var socketIdMember = json.getSocketIdUsers(members);
                for(var i=0;i<socketIdMember.length;i++){
                    //send actor of one user in room by socketID of this user
                    io.to(socketIdMember[i]).emit("actorOfYou",actors[i]);
                }
            }
        })
    })
   
   
}