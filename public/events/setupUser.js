function setUser() {
    let userName = document.getElementById('userName').value;
    if (userName === ""){
        alert("Please enter your user name !!!");
    }
    else {
        socket.emit('set user', userName);
        document.getElementById('buttonSetUser').disabled = true;
        document.getElementById('userName').disabled = true;
    }    
}

function getUsersList() {
    var userList = [];
    for(let i = 0; i < clients.length; i++){
        userList[i] = clients[i].name;
    };
    return userList;
}

function updateUserList(userList) {
    var list = document.getElementById("ulist"); // gan list vao ul
    list.innerHTML = "";
    for(let i = 0; i < userList.length; i++) {
        var item = document.createElement("li");
        item.innerHTML = userList[i];
        list.appendChild(item);
    }
}

socket.on("info", (info_msg) => {
    $("#messages").append("<li>" + info_msg + "</li>");
});
socket.on("users list", (userList) => {
    updateUserList(userList);
})
