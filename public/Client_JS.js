var socket=io("http://localhost:3000/");
var tabChat=0;
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
  for (var i=0; i<data.arrUser.length; i++){
    $("#userOnline").append("<li class='list-group-item' data-id='"+data.arrSocketID[i]+"'><a href='#'>"+data.arrUser[i]+"</a></li>");
  };
});
socket.on("server_send_updateMessage",function(data){
  $("#body-chat").append(
    "<div class='row msg_container base_receive'>"+
      "<div class='col-md-2 col-xs-2 avatar'>"+
          "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
      "</div>"+
      "<div class='col-xs-10 col-md-10'>"+
          "<div class='messages msg_receive'>"+
              "<p>"+data.noidung+"</p>"+
              "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>"+
          "</div>"+
      "</div>"+
  "</div>"
  );
  $('#body-chat').animate({
      scrollTop: $('#body-chat').get(0).scrollHeight}, 1000);
});

socket.on("server_send_your_private_message",function(data){
  if(tabChat===0)
  {
    tabChat=tabChat+1;
    $("#chat_window_1").show();
    $("#chatWith").html('');
       $("#chatWith").append("<h3  class='panel-title chat1' data-id='"+data.id+"'><span class='glyphicon glyphicon-comment'></span> "+data.UserName+" </h3>");
    $("#body-chat").append(
      "<div class='row msg_container base_receive'>"+
        "<div class='col-md-2 col-xs-2 avatar'>"+
            "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
        "</div>"+
        "<div class='col-xs-10 col-md-10'>"+
            "<div class='messages msg_receive'>"+
                "<p>"+data.message+"</p>"+
                "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>"+
            "</div>"+
        "</div>"+
    "</div>"
    );
    $('#body-chat').animate({
        scrollTop: $('#body-chat').get(0).scrollHeight}, 1000);
  }
  else if(data.id==$("h3.chat1").attr("data-id"))
  {
    $("#chat_window_1").show();
    $("#body-chat").append(
      "<div class='row msg_container base_receive'>"+
        "<div class='col-md-2 col-xs-2 avatar'>"+
            "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
        "</div>"+
        "<div class='col-xs-10 col-md-10'>"+
            "<div class='messages msg_receive'>"+
                "<p>"+data.message+"</p>"+
                "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>"+
            "</div>"+
        "</div>"+
    "</div>"
    );
    $('#body-chat').animate({
        scrollTop: $('#body-chat').get(0).scrollHeight}, 1000);
  }
  else // mo tab chat moi
  {
    $("#chat_window_2").show();
    $("#chatWith2").html('');
       $("#chatWith2").append("<h3  class='panel-title chat2' data-id='"+data.id+"'><span class='glyphicon glyphicon-comment'></span> "+data.UserName+" </h3>");
    $("#body-chat2").append(
      "<div class='row msg_container base_receive'>"+
        "<div class='col-md-2 col-xs-2 avatar'>"+
            "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
        "</div>"+
        "<div class='col-xs-10 col-md-10'>"+
            "<div class='messages msg_receive'>"+
                "<p>"+data.message+"</p>"+
                "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>"+
            "</div>"+
        "</div>"+
    "</div>"
    );
    $('#body-chat2').animate({
        scrollTop: $('#body-chat2').get(0).scrollHeight}, 1000);
  }
});

socket.on("server_send_someoneType",function(data){
  if(data.id==$("h3.chat1").attr("data-id"))
  {
    $("#notify_someoneType").html('');
    $("#notify_someoneType").append("<span>"+data.UserName+" is typing now ...</span>");
  }
  else if(data.id==$("h3.chat2").attr("data-id"))
  {
    $("#notify_someoneType2").html('');
    $("#notify_someoneType2").append("<span>"+data.UserName+" is typing now ...</span>");
  }
  
});
socket.on("server_send_stopType",function(data){
  if(data==$("h3.chat1").attr("data-id"))
  {
    $("#notify_someoneType").html('');
    $("#notify_someoneType").append("<span></span>");
  }
  else if(data==$("h3.chat2").attr("data-id"))
  {
    $("#notify_someoneType2").html('');
    $("#notify_someoneType2").append("<span></span>");
  }
  
});

$(document).ready(function(){
  $("#menuLogout").show();
  $("#chat_window_1").hide();
  $("#chat_window_2").hide();
  $('#slider').nivoSlider({
    pauseTime:2000
  });
  $('#userOnline').on('click', 'li', function() {
    // kiểm tra xem tab chat vs ng này đã mở hay chưa
    if(tabChat===0)
    {
      $("#chat_window_1").show();
      $("#chatWith").html('');
      $("#chatWith").append("<h3  class='panel-title chat1' data-id='"+$(this).attr("data-id")+"'><span class='glyphicon glyphicon-comment'></span> "+$(this).text()+" </h3>");
      tabChat=tabChat+1;
    }
    else
    {
      // neu id cua li giong data-id cua chatbox thi khong lam gi neu khac mo tab chat moi
      if($("h3.chat1").attr("data-id")===$(this).attr("data-id"))
      {

      }
      else
      {
        $("#chat_window_2").show();
        $("#chatWith2").html('');
        $("#chatWith2").append("<h3  class='panel-title chat2' data-id='"+$(this).attr("data-id")+"'><span class='glyphicon glyphicon-comment'></span> "+$(this).text()+" </h3>");
        tabChat=tabChat+1;
      }
    }
  });

  ///////////////////////////////////////////////////////////////////////////
  //caroulse
  var clickEvent = false;
  $('#myCarousel').carousel({
    interval:   4000  
  }).on('click', '.list-group li', function() {
      clickEvent = true;
      $('.list-group li').removeClass('active');
      $(this).addClass('active');   
  }).on('slid.bs.carousel', function(e) {
    if(!clickEvent) {
      var count = $('.list-group').children().length -1;
      var current = $('.list-group li.active');
      current.removeClass('active').next().addClass('active');
      var id = parseInt(current.data('slide-to'));
      if(count == id) {
        $('.list-group li').first().addClass('active'); 
      }
    }
    clickEvent = false;
  });
  ///////////////////////////////////////////////////////////////////////////
  var userName=$("#currentUser").text();
  socket.emit("_client_send_userName",userName);
  $("#btnLogout").on("click",function(){
    socket.emit("client_send_userLogout");
  });
  $("#btnSendMessage").click(function(){
    if($("h3.chat1").attr("data-id")==undefined)
    {
      socket.emit("client_send_message",$("#txtMessage").val());
    }
    else
    {
      socket.emit("client_send_private_message",{id:$("h3.chat1").attr("data-id"),message:$("#txtMessage").val()});
    }
  	
  	$("#body-chat").append(
      "<div class='row msg_container base_sent'>" +
          "<div class='col-md-10 col-xs-10'>" +
              "<div class='messages msg_sent'>" +
                  "<p>"+$("#txtMessage").val()+"</p>" +
                  "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>" +
              "</div>"+
          "</div>"+
          "<div class='col-md-2 col-xs-2 avatar'>" +
              "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
          "</div>"+
      "</div>"
    );
  	$("#txtMessage").val('');
    $('#body-chat').animate({
      scrollTop: $('#body-chat').get(0).scrollHeight}, 1000);
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
    socket.emit("client_send_userType",$("h3.chat1").attr("data-id"));
  });
  $("#txtMessage").focusout(function(){
    socket.emit("client_send_stopType",$("h3.chat1").attr("data-id"));
  });

  /////////////////////////////////////////////
  //tabchat2 notify someone type
  $("#txtMessage2").focusin(function(){
    socket.emit("client_send_userType",$("h3.chat2").attr("data-id"));
  });
  $("#txtMessage2").focusout(function(){
    socket.emit("client_send_stopType",$("h3.chat2").attr("data-id"));
  });
  /////////////////////////////////////////////

  $(window).on('beforeunload', function(){ 
    $("#btnLogout").click();
  });


  //////////////////////////////////////////
  // tabChat2 event
$("#btnSendMessage2").click(function(){
    if($("h3.chat2").attr("data-id")==undefined)
    {
      socket.emit("client_send_message",$("#txtMessage2").val());
    }
    else
    {
      socket.emit("client_send_private_message",{id:$("h3.chat2").attr("data-id"),message:$("#txtMessage2").val()});
    }
    
    $("#body-chat2").append(
      "<div class='row msg_container base_sent'>" +
          "<div class='col-md-10 col-xs-10'>" +
              "<div class='messages msg_sent'>" +
                  "<p>"+$("#txtMessage2").val()+"</p>" +
                  "<time datetime='2009-11-13T20:00'>Timothy • 51 min</time>" +
              "</div>"+
          "</div>"+
          "<div class='col-md-2 col-xs-2 avatar'>" +
              "<img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class='img-responsive'>"+
          "</div>"+
      "</div>"
    );
    $("#txtMessage2").val('');
    $('#body-chat2').animate({
      scrollTop: $('#body-chat2').get(0).scrollHeight}, 1000);
  });
  $("#txtMessage2").keyup(function(event){
    if(event.keyCode == 13){
        $("#btnSendMessage2").click();
    }
  });
  //////////////////////////////////////////////


  // event icon chat box clic
  //////////////////////////////////////////////////////////////////////////////////////
  $(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chat_window_1" ).remove();
});
$(document).on('click', '.close2', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    $( "#chat_window_2" ).remove();
});
});
///////////////////////////////////////////////////////////////////////////////////////////

$(window).on('load',function() {
    var boxheight = $('#myCarousel .carousel-inner').innerHeight();
    var itemlength = $('#myCarousel .item').length;
    var triggerheight = Math.round(boxheight/itemlength+1.2);
  $('#myCarousel .list-group-item').outerHeight(triggerheight);
});