$(document).ready(function(){
    //now write your code

    $("#buttonHideFriend").click(function(){
        $("#rightHome").delay(200).fadeOut(0);
        $("#rightHomeMini").delay(200).fadeIn(0);
    })

    $("#buttonShowFriend").click(function(){
        $("#rightHomeMini").delay(200).fadeOut(0);
        $("#rightHome").delay(200).fadeIn(0);
    })

})