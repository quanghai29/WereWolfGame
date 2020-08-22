const fs = require('fs');
const pathUserjson = './config/user.json';
const pathRoomjson = './config/room.json'
var uuidv1 = require('uuidv1');


// random array actor
const randomActor = function(a){
    var result = [];
    while(a.length != 0){
      var index = Math.floor(Math.random() * a.length);
      result.push(a[index]);
      var removed = a.splice(index, 1);
    }
    return result;
}

// random id room 
const makeid = function(length){
    var text = "";
    var possible = "0123456789";
   
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
   
    return text;
}

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
            
            if(roomID == null){//room have no place -> create new room
                //create new room ID;
                roomID = makeid(10);

                var newRoom = {
                    "id": roomID,
                    "type":type,
                    "members": [],
                    "actor": [],
                    "place": type-1,
                };
                //console.log(newRoom);
                newRoom.members.push(username);
                var a = [1,2,2,3];

                newRoom.actor = randomActor(a);

                //console.log(newRoom);
                data.rooms.push(newRoom);
                data.index.push(newRoom.id);
            }

            fs.writeFileSync(pathRoomjson, JSON.stringify(data), (err) => {
                if (err) console.log('Error writing file:', err)
            })
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
            var index = data.index.indexOf(roomID);

            //get members in room
            members = data.rooms[index].members;

            if(data.rooms[index].place == 0)
                //get actor in room
                actors = data.rooms[index].actor;
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
                var index = data.user.indexOf(usersname[i]);
                socketIdUsers[i] = data.index[index];
            }
        } catch (error) {
            console.log(error);
        }
        return socketIdUsers;
    },
    getSocketIdUser: (username) =>{
        var socketId =  null;
        try {
            var dataString = fs.readFileSync(pathUserjson , 'utf8');
            var data = JSON.parse(dataString);
            var index = data.user.indexOf(username);
            if(index >=0)
                socketId = data.index[index];
            
        } catch (error) {
            console.log(error);
        }
        return socketId;
    },
    getSocketUsernames: () =>{
        var socketUsernames = [];
        try {
            var dataString = fs.readFileSync(pathUserjson , 'utf8');
            var data = JSON.parse(dataString);
            for(var i=0; i < data.user.length;i++){
                socketUsernames[i] = data.user[i];
            }
            
        } catch (error) {
            console.log(error);
        }
        return socketUsernames;
    },
}
