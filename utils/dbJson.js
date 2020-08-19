const fs = require('fs');
const pathUserjson = './config/user.json';
const pathRoomjson = './config/room.json'
module.exports = {
    updateSocketID: (username, socketID) =>{
        fs.readFile( pathUserjson , 'utf8', function (err, dataString) {
            if (err) {
                console.log(err);
                return err;
            }
            try {
                console.log(dataString);
                var data = JSON.parse(dataString);
                if(data[username]){
                    data[username] = socketID;
                }else{
                    //data.`${username}` = socketID;
                }

                
                fs.writeFile(pathUserjson, JSON.stringify(data), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
            } catch(err) {
                console.log('Error parsing JSON string:', err)
            }
        });
    },
    findRoomPlace: (username,type) =>{
        var roomID = null;
        try {
            var dataString = fs.readFileSync(pathRoomjson , 'utf8');
            var data = JSON.parse(dataString);
            //console.log(data.index);
            //find room place
            for(let i = 0;i< data.rooms.length;i++){
                if(data.rooms[i].place != 0){
                    roomID = data.rooms[i].id;
                    data.rooms[i].members.push(username);
                    data.rooms[i].place--;
                    break;
                }
            }
            
            if(roomID != null){//update attribute of room
                fs.writeFileSync(pathRoomjson, JSON.stringify(data), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
            }else{//room have no place -> create new room

            }
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
        return roomID;
    },
    getMemberInRoom: (roomID) =>{
        var actors = null;
        var members = [];
        try {
            var dataString = fs.readFileSync(pathRoomjson , 'utf8');
            var data = JSON.parse(dataString);
            //index of room
            var index = data.index[`${roomID}`];

            //get members in room
            members = data.rooms[`${index}`].members;

            if(data.rooms[`${index}`].place == 0)
                //get actor in room
                actors = data.rooms[`${index}`].actor;
        } catch(err) {
            console.log(err);
        }
        return [members, actors];
    },
    getSocketIdUsers: (usersname) =>{
        var socketIdUsers = [];
        try {
            var dataString = fs.readFileSync(pathUserjson , 'utf8');
            var data = JSON.parse(dataString);
            for(var i=0; i < usersname.length;i++){
                socketIdUsers[i] = data[usersname[i]];
            }
        } catch (error) {
            console.log(error);
        }
        return socketIdUsers;
    },
    getSocketIdUser: (usersname) =>{
        var socketId =  null;
        try {
            var dataString = fs.readFileSync(pathUserjson , 'utf8');
            var data = JSON.parse(dataString);
            socketId = data[usersname];
            
        } catch (error) {
            console.log(error);
        }
        return socketId;
    }
}
