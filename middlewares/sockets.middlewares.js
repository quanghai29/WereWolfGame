const json = require('../utils/dbJson');
const socketio = require('socket.io');
const game= require('../config/game.json');
const sleep = require('util').promisify(setTimeout);
const redis = require("redis");
const myUtil = require('../utils/myutil');
const client = redis.createClient();
 
client.on("error", function(error) {
  console.error(error);
});
client.flushdb( function (err, succeeded) {
    console.log("delete all cache" + succeeded); // will be true if successfull
});
module.exports = function (app, server) {
    const io =  socketio.listen(server);
    io.on("connection",(socket)=>{
        //console.log("co nguoi truy cap: "  + socket.id);
        var roomID = null;
        
        //update id
        socket.on("username",(username)=>{
            socket.username = username;
            socket.join(roomID);
            json.updateSocketID(username,socket.id);
        })
       

        //wait Game
        //Input room = ["username", "type"]
        socket.on("waitGame",async (room)=>{
            
            //JOIN user to a room
            roomID = json.findRoomPlace(room[0], room[1]);
            console.log("find roomID: " + roomID);
            socket.join(roomID);
            socket.roomID = roomID;
            socket.emit("roomID",roomID);

            // receive member in room, an randoom actors 
            // mebers = []
            // actors = [] if fullplace else actors = null 
            var [members, actors] = await json.getMemberInRoom(roomID);

            //send list members in room for all user on room
            console.log("member in room");
            io.sockets.in(roomID).emit("list-members-in-room",members);

            //already play
            if(actors !=null){
                client.rpush(roomID + "result",actors);
                 //get a array socketID of member in 'roomID'
                var socketIdMember = json.getSocketIdUsers(members);
                console.log(socketIdMember);
                for(var i=0;i<socketIdMember.length;i++){
                    //send actor of one user in room by socketID of this user
                    io.to(socketIdMember[i]).emit("actorOfYou",actors[i]);
                }

                //play Game
                //control a game in a room
                const report = 15;//15
                const wait = 5;//5
                const afternoon = 15;//15
                const morning = 15;//30
                
                
                (async () => {
                    io.sockets.in(roomID).emit("prepare-afternoon",wait);
                    await sleep((wait+2)*1000);
                    while(1==1)
                    {
                        io.sockets.in(roomID).emit("notify-prepare-afternoon",wait);
                        await sleep(2700);
                        //get actor (can be changed)
                        var exActor = null;
                        client.lrange(roomID + "result",0,-1, (err,value)=>{
                            if(err){
                                console.log(err);
                                return ;
                            }
                            console.log("actor of result");
                            console.log(value);
                            exActor = value;
                        })

                        await sleep(300);
                        //start specified enable of actor
                        for(var i=0;i<socketIdMember.length;i++){
                            //send actor of one user in room by socketID of this user
                            var codeAbility = game[exActor[i]].ability;
                            io.to(socketIdMember[i]).emit("use-ability",codeAbility);
                        }

                        await sleep(2200);
                        //Thời gian tối, user sử dụng chức năng của nhân vật                    
                        io.sockets.in(roomID).emit("afternoon",afternoon); 
                        await sleep((afternoon + 3)*1000);

                        //Xét thắng thua (TH phe dân die)
                        var [code , result] = [,[]];
                        client.lrange(roomID + "result",0,-1, (err,value)=>{
                            if(err){
                                console.log(err);
                                return ;
                            }
                            console.log("Win Or Fail");
                            [code,result] = myUtil.findWinMember(value,actors);
                        })
                        await sleep(500);
                        console.log(code);
                        console.log(result);
                        if(code!=0){
                            await sleep(1000);
                            console.log("Kết thúc game");
                            for(var i=0;i<socketIdMember.length;i++){
                                //send actor of one user in room by socketID of this user
                                io.to(socketIdMember[i]).emit("end-game",result[i]);
                            }
                            client.del(roomID + "result");
                            break;
                        }


                        //Trời sáng có thể thảo luận tự do
                        io.sockets.in(roomID).emit("morning", morning);
                        await sleep((morning + 2)*1000);
    
                        //cache result of report wolf
                        client.rpush([roomID,0,0,0,0]);
                        
                        //report sói
                        io.sockets.in(roomID).emit("report-wolfman",report);
                        await sleep((report + 2)*1000);
    
                        //xem ai bị bầu là sói cao nhất
                        client.lrange(roomID,0,-1,async (err,value)=>{
                            if(err) {
                                console.log(err);
                                return;
                            }
                            console.log("tìm người bị loại");
                            console.log(value);
                            var indexOfMax = myUtil.oneMaxValueOfArray(value);
                            if(indexOfMax != -1){
                                //thành viên bị loại
                                client.lrange(roomID + "result",0,-1,(err,value)=>{
                                    if(err){
                                        console.log(err);
                                        return;
                                    }
                                    value[indexOfMax] = -1;
                                    client.del(roomID + "result");
                                    client.rpush(roomID + "result" ,value);
                                    console.log(value);
                                })
                                io.sockets.in(roomID).emit("a-player-out",[indexOfMax,actors[indexOfMax]]);
                                await sleep(1000);
                            }
                            client.del(roomID);
                        })
                        await sleep(300);
    
                       
                        //xét thắng thua ====================
                        client.lrange(roomID + "result",0,-1, (err,value)=>{
                            if(err){
                                console.log(err);
                                return ;
                            }
                            console.log("Win Or Fail");
                            [code,result] = myUtil.findWinMember(value,actors);
                        })
                
                        await sleep(500);
                
                        console.log(code);
                        console.log(result);
                        if(code!=0){
                            await sleep(1000);
                            console.log("Kết thúc game");
                            for(var i=0;i<socketIdMember.length;i++){
                                //send actor of one user in room by socketID of this user
                                io.to(socketIdMember[i]).emit("end-game",result[i]);
                            }
                            client.del(roomID + "result");
                            break;
                        }
                    }
                })()
            }
        })

        socket.on("reportWolf",async (player)=>{
            var [members, actors] = await json.getMemberInRoom(roomID);
            var index = members.indexOf(player);
            // //client.expire(roomID,10);
            client.lrange(roomID,0,-1, (err,value)=>{
                if(err) {
                    console.log(err);
                    return;
                }
                //FIX BUG HERE
                //client.flushdb();
                value[index]++;
                client.del(roomID);
                client.rpush(roomID,value);
                console.log("report wolf");
                console.log(value);
            })
        })

        socket.on("showPlayer",async (player)=>{
            var [members, actors] = await json.getMemberInRoom(roomID);
            //show ability of member
            var index = members.indexOf(player);
            console.log("show player");
            console.log(actors);
            socket.emit("a-player-showed",[player,actors[index]]);
        })

        socket.on("killPlayEr",async (player)=>{
            var [members, actors] = await json.getMemberInRoom(roomID);
           //change ability of killer
           console.log("a-player-killed");
           console.log(actors);
           var index = members.indexOf(player);
           io.sockets.in(roomID).emit("a-player-killed",[player,actors[index]]);
           client.lrange(roomID + "result",0,-1,(err,value)=>{
               if(err){
                   console.log(err);
                   return;
               }
               value[index] = -1;
               client.del(roomID + "result");
               client.rpush(roomID + "result" ,value);
               console.log("kill a player");
               console.log(value);
           })
        })
        //chat room
        socket.on('send', function (data) {
            //io.sockets.emit('send', data);
            console.log('send message');
            io.sockets.in(roomID).emit('send',data)
        });

        //list friend
        socket.on("load-list-friend",() =>{
            var usernames = json.getSocketUsernames();
            io.sockets.emit("list-friend",usernames);
        })
    })


    
}