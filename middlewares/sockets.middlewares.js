const json = require('../utils/dbJson');
const socketio = require('socket.io');
const game= require('../config/game.json');
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
                const wait = 5;
                const afternoon = 15;
                const morning = 30;
                (async () => {
                    io.sockets.in(roomID).emit("prepare-afternoon",wait);
                    await sleep(5*1000);

                    var actor = -1;
                    var user = null;
                    var code = -1;
                    
                    
                    //start specified enable of actor
                    for(var i=0;i<socketIdMember.length;i++){
                        //send actor of one user in room by socketID of this user
                        var codeAbility = game[actors[i]].ability;
                        io.to(socketIdMember[i]).emit("use-ability",codeAbility);
                    }
                    io.sockets.in(roomID).emit("afternoon",afternoon);

                    socket.on("killPlayEr",(player)=>{
                        //change ability of killer
                        var index = members.indexOf(player);
                        actors[index] = -1;
                        code = 1;
                        user = player;
                    })

                    socket.on("showPlayer",(player)=>{
                         //change ability of killer
                         var index = members.indexOf(player);
                         actor = actors[index];
                         code = 2;
                         user = player;
                    })

                    
                    await sleep((afternoon + 1)*1000);
                    if(code == 1){
                        io.sockets.in(roomID).emit("a-player-killed",user);
                    }
                    if(code == 2){
                        socket.emit("a-player-showed",[user,actor]);
                    }

                    io.sockets.in(roomID).emit("morning", morning);
                    await sleep((morning + 1)*1000);

                    //send choose sói

                })()
                
                // io.sockets.emit("start-game");
            }
        })

        //chat room
        socket.on('send', function (data) {
            io.sockets.emit('send', data);
        });

        //list friend
        socket.on("load-list-friend",() =>{
            var usernames = json.getSocketUsernames();
            io.sockets.emit("list-friend",usernames);
        })
    })
}