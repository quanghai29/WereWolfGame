var maxMemberRoom  = 4;
var members ;
var player = null;
var codeAble = -1;
var Result = -2;
var roomID = socket.roomID;
$(document).ready(function () {
  $("#rightHome").fadeOut(0);
  $("#rightHomeMini").fadeIn(0);
  //setTimeout($("#notify").hide(), 5000);
  $("#ability").click(()=>{
    if(player!=null){
      if(codeAble == 0){
        //Bầu chọn
        socket.emit("reportWolf",player);
        codeAble = -1;
        player = null;
        $("#ability").css("opacity","0.5");
      }
      if(codeAble == 1){
        console.log("killPlayer");
        socket.emit("killPlayEr",player);
        codeAble = -1;
        player = null;
        $("#ability").css("opacity","0.5");
      }
      if(codeAble == 2){
        socket.emit("showPlayer",player);
        codeAble = -1;
        player = null;
        $("#ability").css("opacity","0.5");
      }
    }
    if(Result!=-2){
      window.history.back();
    }
  })
});


//require create roomID
socket.emit("waitGame",[username,maxMemberRoom]);
socket.on("roomID",(roomID)=>{
  $("#roomID").text("id: " + roomID);
})
socket.on("list-members-in-room",(mbs)=>{
  members = mbs;
  ReactDOM.render(<Mycard members={mbs}/>, document.getElementById('main'));
})

socket.on("actorOfYou",(actor)=>{
  $.getJSON( "/game.json", function(data) {
    $("#actor").fadeIn();
    var idPlayer = "#" + username;
    $(idPlayer).children().prop('disabled',true);
    $(idPlayer).children(":first").text( data[actor].name);
    ReactDOM.render(<Actor actor={data[actor].name}/>, document.getElementById('actor'));
  });
})

socket.on("prepare-afternoon",(time)=>{
  var prepareAfternoon = setInterval(() => {
    $("#min").text(time + "s");
    time--;
    if(time <0){
      $("#actor").fadeOut("slow");
      clearInterval(prepareAfternoon);
    }
  }, 1000);
})

socket.on("notify-prepare-afternoon",(time)=>{
  $("#notify").text("Trời Tối");
  $("#notify").show("slow");
  $("#notify").animate({left: "300px"},1000,()=>{
    $("#notify").fadeOut(1000);
  })
})

socket.on("afternoon",(time)=>{
  $("#time").text("Trời Tối");
  var afternoon = setInterval(() => {
    $("#min").text(time + "s");
    time--;
    if(time <0){
      clearInterval(afternoon);
    }
  }, 1000);
})


socket.on("use-ability",(code)=>{
  codeAble = code;
  console.log(codeAble);
  if(code == 1){
    //kích sát
    $("#notify").text("Chọn Người Để Kích Sát");
    $("#notify").show("slow");
    $("#notify").animate({left: "180px"},1700,()=>{
      $("#notify").fadeOut("slow");
    })
    $("#ability").text("Kích Sát");
  }else if(code == 2){
    //dự đoán
    $("#notify").text("Chọn Người Để Dự Đoán");
    $("#notify").show("slow");
    $("#notify").animate({left: "180px"},1700,()=>{
      $("#notify").fadeOut("slow");
    });
    $("#ability").text("Dự Đoán");
  }else if(code == 0){
    //bình thường
    $("#ability").text("Ability");
  }
  //Click ability
})

//data = [player,actor]
socket.on("a-player-killed",(data)=>{
  var actor = data[1];
  var idPlayer = "#" + data[0];
  $(idPlayer).css("background-color","#f4f4f4");
  $("#notify").text(data[0] + " đã bị giết");
  $("#notify").show();
  $("#notify").animate({left: "180px"},1000,()=>{
    $("#notify").fadeOut("slow");
  });
  //$(idPlayer).css("opacity","0.6");
  $(idPlayer).children().prop('disabled',true);
  $.getJSON( "/game.json", function(data) {
    var name = data[actor].name;
    $(idPlayer).children(":first").text(name + " (die)");
  });
})

//data = [player,actor]
socket.on("a-player-showed",(data)=>{
  var idPlayer = "#" + data[0];
  var actor = data[1];
  $(idPlayer).css("opacity","1");
  $.getJSON( "/game.json", function(data) {
    var name = data[actor].name;
    console.log(name);
    $(idPlayer).children(":first").text(name);
  });
})


socket.on("morning",(time)=>{
  //reset varible global
  codeAble = -1;
  player = null;
  $("#time").text("Trời Sáng");
  $("#notify").text("Thảo luận tìm ra sói");
  $("#notify").show();
  $("#notify").animate({left: "220px"},1000,()=>{
    $("#notify").fadeOut("slow");
  })
  $("#ability").text("Thảo luận")

  var morning = setInterval(() => {
    $("#min").text(time + "s");
    time--;
    if(time <0){
      clearInterval(morning);
    }
  }, 1000);
})

socket.on("report-wolfman",(time)=>{
  //reset varible global
  codeAble = 0;
  $("#time").text("Trời Sáng");
  $("#notify").text("Bầu chọn 1 người là sói");
  $("#notify").show();
  $("#notify").animate({left: "220px"},1000,()=>{
    $("#notify").fadeOut("slow");
  })
  $("#ability").text("Bầu Chọn");
  var report = setInterval(() => {
    $("#min").text(time + "s");
    time--;
    if(time <0){
      clearInterval(report);
    }
  }, 1000);
})

// data [indexofmember, actorofmemer]
socket.on("a-player-out",(data)=>{
  var idPlayer ="#" + members[data[0]];
  var actor = data[1];
  $(idPlayer).css("background-color","#f4f4f4");
  $("#notify").text(members[data[0]] + " đã bị out");
  $("#notify").show();
  $("#notify").animate({left: "180px"},1000,()=>{
    $("#notify").fadeOut("slow");
  });
  $(idPlayer).children().prop('disabled',true);
  $.getJSON( "/game.json", function(data) {
    var name = data[actor].name;
    $(idPlayer).children(":first").text(name + " (die)");
  });
})

socket.on("end-game",(codeResult)=>{
  Result = codeResult;
  var textNote = "Thắng Cuộc";
  if(codeResult == -1)
    textNote = "Thua Cuộc";
  $("#time").text("Kết Thúc");
  $("#notify").text(textNote);
  $("#notify").show();
  $("#notify").animate({left: "180px"},1000,()=>{
    
  });
  $("#ability").text("Về Sảnh");
  $("#ability").css("opacity","1");
})

//Chat in this room
//Socket nhận data và append vào giao diện
socket.on("send", function (data) {
  console.log(data);
  $(".allMess").append("<p class='message text-light'>" + data.username + ": " + data.message + "</p>")
})

//Bắt sự kiện click gửi message
$("#send").on('click', function () {
  var message = $('#typeChat').val();

  if (message == '') {
      alert('Please message!!');
  } else {
      //Gửi dữ liệu cho socket
      socket.emit('send', {username: username, message: message});
      $('#typeChat').val('');
  }
})

$("#typeChat").keyup(function(event) {
  if (event.keyCode === 13) {
      $("#send").click();
  }
});




//function support
function clickAcivity(value){
  if(codeAble != -1){
    player = value;
    var idPlayer = "#" + player;
    $(".mycard").css("opacity","1");
    $(idPlayer).css("opacity","0.6");
    $("#ability").css("opacity","1");
  }
}

//react support
class Mycard extends React.Component {
  render() {
    var members = this.props.members;
    var listmember = [];

    for(var i=0;i<members.length;i++){
      listmember.push(
        <div class="mycard" id={members[i]}>
          <button class="btnClickPlayer" type="button" value={members[i]} onClick={e => clickAcivity(e.target.value)}>Use Ability</button>
          <img class="myCardImg" src="/img/user/avatar1.png" alt="nhân vật"/>
          <h4 class="nickName">{members[i]}</h4>
        </div>
      )
    }
    return (
      <div class ="display">{listmember}</div>
    );
  }
}

class Actor extends React.Component{
  render(){
    return(
      <div class="mycard">
        <img class="myCardImg" src="/img/user/avatar1.png" alt="nhân vật"/>
        <h5>  Nhân vật của bạn</h5>
        <h4 class="nickName">{this.props.actor}</h4>
      </div>
    );
  }
}


