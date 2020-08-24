var socket = io('localhost:3000');
socket.emit("username",username);
socket.emit("load-list-friend");
socket.on("list-friend", (usernames) => {
    $("#listFriend").empty();
    for(var i = 0; i < usernames.length; i++){
       
        $("#listFriend").append("<div class='d-flex justify-content-between' id='member'>" +
            "<div class='d-flex'>" + 
                "<img src='/img/user/avatar1.png' class='img-fluid mt-2 mb-2 p-1' alt='account'"+
                    "id='friendAvartar'>"+
                "<h6 class='mt-3 ml-3'>"+usernames[i]+"</h6>"+
            "</div>"+
            "<div>"+
                "<i class='fas fa-circle fa-2x ml-2 mt-3 text-success' id='online-status'></i>"+
            "</div>"+
        "</div>"
        )}
  });
$(document).ready(function(){
    //now write your code

    //handle btn
    $("#buttonHideFriend").click(function(){
        $("#rightHome").delay(200).fadeOut(0);
        $("#rightHomeMini").delay(200).fadeIn(0);
    })

    $("#buttonShowFriend").click(function(){
        $("#rightHomeMini").delay(200).fadeOut(0);
        $("#rightHome").delay(200).fadeIn(0);
    })
})

