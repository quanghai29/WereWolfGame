var maxMemberRoom  = 4;
$(document).ready(function () {
  $("#rightHome").fadeOut(0);
  $("#rightHomeMini").fadeIn(0);
});


//require create roomID
socket.emit("waitGame",[username,maxMemberRoom]); 
socket.on("list-members-in-room",(mbs)=>{
  ReactDOM.render(<Mycard members={mbs}/>, document.getElementById('main'));
})

socket.on("actorOfYou",(actor)=>{
  $.getJSON( "/game.json", function(data) {
    ReactDOM.render(<Actor actor={data[actor].name}/>, document.getElementById('actor'));
  });
})

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


//react support
class Mycard extends React.Component {
  render() {
    var members = this.props.members;
    var listmember = [];

    for(var i=0;i<members.length;i++){
      listmember.push(
        <div class="mycard">
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
        <h4 class="nickName">{this.props.actor}</h4>
      </div>
    );
  }
}


