var isTyping = false;
var typingTimer;
$("#inputMessage").on("input", () => {
    if ($("#userName").val().length !== 0 && $("#inputMessage").val().length !== 0 && isTyping === false) {
        socket.emit("typing");
        isTyping = true;

        // neu dung type qua 3s se chuyen ve trang thai pause
        $("#inputMessage").on('keyup', (e) => {
            clearTimeout(typingTimer);
            if(e.key === "Enter")
            {
                socket.emit("not typing");
            }
            else {
                typingTimer = setTimeout(pauseTyping, 3000);
            }
          });
        $("#inputMessage").on('keydown', () => {
            clearTimeout(typingTimer);
          });
        function pauseTyping(){
            socket.emit("pause");
            isTyping = false;
            setTimeout(function() {
                socket.emit("not typing");
            }, 3000);
        }
    }
    else if ($('#inputMessage').val() === ""){
        socket.emit("not typing");
        isTyping = false;
    }
})

socket.on("typing flag", (userList) => {
    // update userlist khi hien hoac khong hien ki tu typing
    updateUserList(userList);                      
})
