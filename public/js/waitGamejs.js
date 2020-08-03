
$(document).ready(function () {
    //require create roomID
    socket.emit("waitGame","haimtp"); 
    socket.on("list-members-in-room",(members)=>{
        console.log(members);
    })
});
$.getJSON( "/game.json", function(data) {
    console.log(data["hai"]);
});