const fs = require('fs');
const pathUserjson = './config/user.json';
const pathRoomjson = './config/room.json'
var uuidv1 = require('uuidv1');

module.exports = {
    updateSocketID: (username, socketID) =>{
        fs.readFile( pathUserjson , 'utf8', function (err, dataString) {
            if (err) {
                console.log(err);
                return err;
            }
            try {
                //console.log(dataString);
                var data = JSON.parse(dataString);
                var indexUser = data.user.indexOf(username);

                //already user
                if(indexUser >= 0){
                    //console.log(indexUser);
                    data.index[indexUser] = socketID;
                }else {
                    //insert user
                    data.user.push(username);
                    data.index.push(socketID);
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
            console.log(typeof(data));
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
                var newRoom = {
                    id: uuidv1(),
                    members: [],
                    place: type--,
                    actor: []
                }
                newRoom.members.push(username);
                var a = [1,2,2,3];
                while(a.length != 0){
                  var index = Math.floor(Math.random() * a.length);
                  newRoom.actor.push(a[index]);
                  var removed = a.splice(index, 1);
                }
                data.room.push(newRoom);
                data.index.push(newRoom.id);
                json = JSON.stringify(data); //convert it back to json
                fs.writeFile(pathRoomjson, json, 'utf8'); 
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
                var index = data.index.indexOf(username[i]);
                socketIdUsers[i] = data.user[index];
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
