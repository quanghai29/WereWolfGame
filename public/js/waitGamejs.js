var maxMemberRoom  = 4;
$(document).ready(function () {
});

//require create roomID
socket.emit("waitGame",["haimtp",4]); 
socket.on("list-members-in-room",(members)=>{
    ReactDOM.render(<MemberInRoom members={members}/>, document.getElementById('main'));
})
socket.on("actorOfYou",(actor)=>{
  //alert(actor);
})

$.getJSON( "/game.json", function(data) {
    console.log(data["hai"]);
});



//react support
class Mycard extends React.Component {
  render() {
    return (
      <div class="mycard">
        <img class="myCardImg" src="/img/user/avatar1.png" alt="nhân vật"/>
        <h4 class="nickName">{this.props.name}</h4>
      </div>
    );
  }
}

class MemberInRoom extends React.Component{
  constructor(props) {
    super(props);

    var members = this.props.members;
    const people = [];

    for (let i = 0; i < members.length; i++) {
        people.push(<Mycard name={members[i]}/>);
    }
    this.state = { people };
  }
  render(){
    return (
      <div class="main">
        {this.state.people}
      </div>
    )
  }
}

