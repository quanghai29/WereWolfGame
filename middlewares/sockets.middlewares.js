var socketio = require('socket.io');
module.exports = function (app, server) {
    const io =  socketio.listen(server);
    io.on("connection",(socket)=>{
        console.log("co nguoi truy cap: "  + socket.id);
        
    })
}