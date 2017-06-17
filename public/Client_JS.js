var socket=io("http://localhost:3000/");
socket.on("_server_send_loginSucess",function(data){
//   $("#loginForm").hide();
//   $("#menuLogout").show();
//   $("#menuRegister").hide();
//   $("#chatForm").show();
//   $("#currentUser").html("");
//   $("#currentUser").append("Xin chào "+data);
//   userName=data;
// });
// socket.on("_server_send_loginFail",function(){
//   alert("UserName da ton tai, vui long chon UserName khac");
});
socket.on("_server_send_updateChatList",function(data){
  $("#userOnline").html("");
  data.forEach(function(value){
  $("#userOnline").append("<li class='list-group-item'><a href=#>"+value+"</a></li>");
  });
});
socket.on("server_send_updateMessage",function(data){
  alert("đang nhận");
  $("#listMessage").append("<strong class='bold'>"+data.nguoigui+" : </strong><span class='user_Message'>"+data.noidung+"</span></br>");
  $("#listMessage").scrollTop($("#listMessage").height());
});
socket.on("server_send_someoneType",function(data){
  $("#notify_someoneType").html('');
  $("#notify_someoneType").append("<span>"+data+" is typing now ...</span>");
});
socket.on("server_send_stopType",function(){
  $("#notify_someoneType").html('');
  $("#notify_someoneType").append("<span></span>");
});
$(document).ready(function(){
  // $("#loginForm").show();
  $("#chatForm").show();
  $("#menuLogout").show();
  $("#menuRegister").hide();
  $('#slider').nivoSlider({
    pauseTime:2000
  });
  var userName=$("#currentUser").text();
  socket.emit("_client_send_userName",userName);
  $("#logout").on("click",function(){
    socket.emit("client_send_userLogout");
  });
  $("#btnSendMessage").click(function(){
    alert("send message");
	socket.emit("client_send_message",$("#txtMessage").val());
	$("#listMessage").append("<span class='myMessage'>"+$("#txtMessage").val()+"</span><strong> : "+userName+"</strong></br>");
	$("#txtMessage").val('');
  });
  $("#txtMessage").keyup(function(event){
    if(event.keyCode == 13){
        $("#btnSendMessage").click();
    }
  });
  $("#txtUserName").keyup(function(event){
    if(event.keyCode == 13){
        $("#btnRegister").click();
    }
  });
  $("#txtMessage").focusin(function(){
    socket.emit("client_send_userType");
  });
  $("#txtMessage").focusout(function(){
    socket.emit("client_send_stopType");
  });
  $(window).on('beforeunload', function(){ 
    $("#btnLogout").click();
  });
});