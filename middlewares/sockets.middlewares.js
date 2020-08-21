const json = require('../utils/dbJson');
const socketio = require('socket.io');
const sleep = require('util').promisify(setTimeout);
module.exports = function (app, server) {
    var roomID = null;
    const io =  socketio.listen(server);
    io.on("connection",(socket)=>{
        //console.log("co nguoi truy cap: "  + socket.id);
        //update id
        socket.on("username",(username)=>{
            socket.username = username;
            socket.join(roomID);
            json.updateSocketID(username,socket.id);
        })
       
        
        // socket.join(room);
        // io.in(room).clients((err,clis) => {
        //     console.log(clis);
        // });

        //wait Game
        //Input room = ["username", "type"]
        socket.on("waitGame",async (room)=>{
            //JOIN user to a room
            roomID = json.findRoomPlace(room[0], room[1]);
            console.log("find roomID: " + roomID);
            socket.join(roomID);
            socket.roomID = roomID;

            // receive member in room, an randoom actors 
            // mebers = []
            // actors = [] if fullplace else actors = null 
            var [members, actors] = await json.getMemberInRoom(roomID);

            //send list members in room for all user on room
            console.log("member in room");
            io.sockets.in(roomID).emit("list-members-in-room",members);

            //already play
            if(actors !=null){
                //get a array socketID of member in 'roomID'
                var socketIdMember = json.getSocketIdUsers(members);
                console.log(socketIdMember);
                for(var i=0;i<socketIdMember.length;i++){
                    //send actor of one user in room by socketID of this user
                    io.to(socketIdMember[i]).emit("actorOfYou",actors[i]);
                }

                //play Game

                //control a game in a room

                (async () => {
                    console.time("Slept for")
                    await sleep(3000)
                    console.timeEnd("Slept for")
                })()
                
                // io.sockets.emit("start-game");
            }
        })

        //chat room
        socket.on('send', function (data) {
            io.sockets.emit('send', data);
        });


    })
}