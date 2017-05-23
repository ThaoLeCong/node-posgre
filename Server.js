var express=require("express");
var app=express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");

var server=require("http").Server(app);
var io=require("socket.io")(server);
var arrUser=[];
var arrPhong=[];
server.listen(process.env.PORT||3000);

io.on("connection",function(socket){
  console.log("co nguoi ket noi");
  socket.on("disconnect",function(){
    console.log(socket.id +" vua ngat ket noi");
  });
  socket.on("_client_send_userName",function(data){
    if(arrUser.indexOf(data)>=0){
      socket.emit("_server_send_loginFail");
    }
    else {
      arrUser.push(data);
      socket.UserName=data;
      socket.emit("_server_send_loginSucess",socket.UserName);
      console.log(socket.UserName+" da dang ky thanh cong");
      io.sockets.emit("_server_send_updateChatList",arrUser);
    }
  });
  socket.on("client_send_userLogout",function(){
    console.log(socket.UserName+" da logout");
    arrUser.splice(arrUser.indexOf(socket.UserName),1);
    socket.broadcast.emit("_server_send_updateChatList",arrUser);
  });
  socket.on("client_send_message",function(data){
	io.sockets.emit("server_send_updateMessage",{nguoigui:socket.UserName,noidung:data});  
  });
  socket.on("client_send_userType",function(){
	socket.broadcast.emit("server_send_someoneType",socket.UserName);
  });
  socket.on("client_send_stopType",function(){
	socket.broadcast.emit("server_send_stopType");
  });
  
  //groupchat
  socket.on("_client_send_groupName",function(data){
	socket.join(data);
	socket.phong=data;
     socket.emit("server_send_create_group_success",socket.phong);
	io.sockets.in(socket.phong).emit("_server_send_update_group_ChatList",arrUser);
  });
  socket.on("client_send_message_to_group",function(data){
	io.sockets.in(socket.phong).emit("server_send_updateGroupMessage",{nguoigui:"tèo",noidung:data});
  });
  socket.on("client_send_user_in_group_Type",function(){
	socket.broadcast.emit("server_send_someone_in_group_Type",socket.UserName);
  });
  socket.on("server_send_group_stopType",function(){
	socket.broadcast.emit("client_send_group_stopType");
  });
});
app.get("/",function(req,res){
  res.render("trangchu");
});

