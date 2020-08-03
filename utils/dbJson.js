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
                var data = JSON.parse(dataString);
                if(data[username]){
                    data[username] = socketID;
                }else{
                    data[`${username}`] = socketID;
                }

                fs.writeFile(pathUserjson, JSON.stringify(data), (err) => {
                    if (err) console.log('Error writing file:', err)
                })
            } catch(err) {
                console.log('Error parsing JSON string:', err)
            }
        });
    },
    findRoomPlace: (username) =>{
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
                fs.writeFile(pathRoomjson, JSON.stringify(data), (err) => {
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
        var members = [];
        try {
            var dataString = fs.readFileSync(pathRoomjson , 'utf8');
            var data = JSON.parse(dataString);
            var index = data.index[`${roomID}`];
            members = data.rooms[`${index}`].members;
        } catch(err) {
            console.log('Error parsing JSON string:', err)
        }
        return members;
    }
}
