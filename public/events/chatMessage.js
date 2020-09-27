// jQuery function .submit() only catch the tag <form>
$('form').submit((event) => {
  event.preventDefault();                                                        // prevent page form submit blank page

  let userName = $("#userName").val();
  let inputMessage = $("#inputMessage").val();
  if(userName === "" || inputMessage === ""){
    alert("Please enter name or message first!!")
  }
  else {
    socket.emit("chat message", {userName:userName, inputMessage:inputMessage}); // socket.emit will send back msg to sender only
    $("#inputMessage").val("");
    isTyping = false;
    socket.emit("not typing");
  }
  return false;                                                                  // stop bubbling
});

let input = document.getElementById("userName");
input.addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
    e.preventDefault();
    document.getElementById("buttonSetUser").click();
    socket.emit("not typing");
  }
});
socket.on("chat message", (msg) => {
  $("#messages").append("<li>" + msg.userName + ": " + msg.inputMessage + "</li>"); 
  delete msg;
});