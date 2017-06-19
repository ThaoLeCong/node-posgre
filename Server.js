var express=require("express");
var app=express();
app.use(express.static("./public"));
app.set("view engine","ejs");
app.set("views","./views");

var server=require("http").Server(app);
var io=require("socket.io")(server);

///////////////////////////////////////
var session=require("express-session");
app.use(session({
    secret: "thao1102",
    resave: true,
    saveUninitialized: true }));
//////////////////////////////////////

//////////////////////////////////////
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
//////////////////////////////////////

//////////////////////////////////////
const Passport=require("passport");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
app.use(Passport.initialize());
app.use(Passport.session());
/////////////////////////////////////

/////////////////////////////////////
var flash=require("connect-flash");
app.use(flash());
/////////////////////////////////////


// cấu hình kết nối db vs sequelize
/////////////////////////////////////
const sequelize=require("sequelize");
const db = new sequelize( {
  database:'DaihoianhhungDB',
  username:'postgres',
  password:'thao1102',
  host: 'localhost',
  port:5432,
  dialect:'postgres',
  dialectOptions:{ssl:false},
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define:{
    freezeTableName: true
  }
});
// test kết nối
db.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
// create table
const User = db.define('account', {
    username: {
      type: sequelize.STRING
    },
    password: {
      type: sequelize.STRING
    },
    email:{
      type: sequelize.STRING
    }
});
/////////////////////////////////////


////////////////////////////////////
// crawl data
// var request = require('request');  
// var cheerio = require('cheerio');
// var url = 'http://vnexpress.net/tin-tuc/khoa-hoc/tri-nho-con-nguoi-giam-vi-dien-thoai-thong-minh-3243543.html';

// request(url, function(err, response, body){  
//   if (!err && response.statusCode == 200) {
//     console.log(body);
//   }
//   else console.log('Error');
// });
////////////////////////////////////

var arrUser=[];
var arrPhong=[];
server.listen(process.env.PORT||3000,function(){
  console.log("server was started at port 3000");
});

io.on("connection",function(socket){
  console.log("co nguoi ket noi");
  socket.on("disconnect",function(){
    console.log(socket.id +" vua ngat ket noi");
  });
  socket.on("_client_send_userName",function(data){
    if(arrUser.indexOf(data)>=0){
      io.sockets.emit("_server_send_updateChatList",arrUser);
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
    console.log(data);
	  socket.broadcast.emit("server_send_updateMessage",{nguoigui:socket.UserName,noidung:data});  
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
  if(req.isAuthenticated())
  {
    res.render('trangchu',{username:req.session.passport.user});
  }
  else
  {
    res.redirect('/login');
  }
});
app.get("/tintuc/:id",function(req,res){
  if(req.isAuthenticated())
  {
    var id=req.params.id;
    res.send("tin tức");
  }
  else
  {
    res.redirect('/login');
  }
});
app.post("/login",Passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/abc',
                                   failureFlash: true })
);
app.get("/login",function(req,res){
  res.render("login");
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});
app.post("/signup", bodyParser.urlencoded({ extended: true }), function (req, res) {
  if (!req.body) return res.sendStatus(400);
  var username=req.body.username;
  var password=req.body.passwd;
  var email=req.body.email;
  console.log(username);
  User.findOne({where:{$or: [{username: username}, {email: email}]}}).then(user=>{
      if(!user)
      {
        User.findOrCreate({where:{username:username,password:password,email:email}}).spread((user, created) => {
        console.log(user.get({
          plain: true
        }))});
        
        res.render("trangchu",{username:username});
      }
      else
        res.send("username đã tồn tại");
    });
});

Passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("đang check");
    User.findOne({where:{username:username}}).then(user=>{
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.get('password')!=password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("Đăng nhập thành công");
      return done(null, user);
    }); 
  }
));
Passport.serializeUser(function (user, done) {
  done(null, user.username);
});
Passport.deserializeUser(function (username, done) {
  User.findOne({where:{username:username}}).then(user=>{
    if (!user) {
      console.log("bạn chưa đăng nhập");
      return done(null, false, { message: 'Incorrect username.' });
    }
    return done(null, user);
    }); 
});
Passport.use(new FacebookStrategy({
    clientID: 734280883409750,
    clientSecret: '76ebf7f12ec59486f0a215c29662ce6a',
    callbackURL: "http://localhost:3000/auth/facebook",
    profileFields:["gender","locale"]
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({where:{username:profile.displayName,password:profile.id}}).spread((user, created) => {
      console.log(user.get({
          plain: true
      }));
      console.log(created);
      done(null, user);
    });
  }
));
app.get('/auth/facebook',
Passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
app.get('/profile',(req,res)=>{
  if(req.isAuthenticated())
  {
    var id=req.params.id;
    res.send("profile");
  }
  else
  {
    res.redirect('/login');
  }
});

