// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require bootstrap-sprockets
//= require rails-ujs

//= require_tree .

$(function(){


  $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');
  $('.row.sideBar-body').on('click',function(){
     $(this).addClass("sideBar-active");
     $(this).siblings().removeClass("sideBar-active");
     var name="";
     var value="";
     var name2="";
     if($(this).find("#room_id_left").length>0){
       name="room";
       name2="user";
     }else{
       name="user"
       name2="room";
     }
    //  roomとidを揃える
     value=$(this).find("#"+name+"_id_left").text().trim();
     $("#get_room_form").find("[name='"+name+"']").val(value);
     $("#get_room_form").find("[name='"+name2+"']").val("");
     $("#get_room").click();
   });

   $(document).on('click','.row.message-body',function(){
      $(this).find(".message-time.col-sm-12").toggleClass("hidden");
    });
});


function send_message(e) {
  if ( e.keyCode !== 13 || ( e.keyCode === 13 && (e.shiftKey === true || e.ctrlKey === true || e.altKey === true) )) { // Enterキー除外
    return true;
  }
  message=$("#comment").val();
  $("#comment").val("");
  if(message.length>0){
    var my_id=$("#my_user_id").val();
    var room_id=$("#room_id").val();
    $("#get_chat_form").find("[name='user_id']").val(my_id);
    $("#get_chat_form").find("[name='content']").val(message);
    $("#get_chat_form").find("[name='room_id']").val(room_id);
    $("#get_chat").click();

    $send_temp=$("#chat_template_sender").children().clone();
    $send_temp.find(".message-text").html(message.replace(/\r?\n/g, "<br>"));

    var now= new Date();
    var hour = now.getHours();
    var minute = ("0"+now.getMinutes()).slice(-2);
    $send_temp.find(".message-time").text(hour+":"+minute);

    $("#conversation").append($send_temp);
    $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');
  }
  return false;
}

function webrtc(peer_id,room_id){

  const peer = new Peer(peer_id+"_"+new Date().getTime(),{
    key:   "db77a719-83fd-4191-a80d-5cc6821706d4",
    debug: 3
  });
  var room
  peer.on('open',function(){
    room=peer.joinRoom(room_id,{mode:"sfu",stream:null});
    room.on('open',function(){
      $("#comment").keydown(function(e){
        if(!send_message(e)){
          room.send({label:"テスト",data:"test"});
          return false;
        }
      });

      room.on("data",function(data){
        console.log(data);
        $("#get_room_form").find("[name='room']").val(room_id);
        $("#get_room_form").find("[name='user']").val("");
        $("#get_room").click();
      })

    })
  })



}
