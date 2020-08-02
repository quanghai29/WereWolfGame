$(document).ready(function () {
    socket.emit("waitGame","haimtp"); 
});
$.getJSON( "/game.json", function(data) {
    console.log(data["hai"]);
});