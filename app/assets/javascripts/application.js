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
  var peer_id=$("#my_user_id").val();
  const peer = new Peer(peer_id,{
    key:   "db77a719-83fd-4191-a80d-5cc6821706d4",
    debug: 3
  });
  document.peer=peer;

  $(document).on('click','#reload_room',function(){
    $("#update_left").click();
  });

  peer.on("error",function(){
    alert("エラーが発生しました。");
  });

  peer.on("open",function(){

    $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');
    $(document).on('click','.row.sideBar-body',function(){
       $(this).addClass("sideBar-active");
       $(this).siblings().removeClass("sideBar-active");
       var name="";
       var value="";
       var name2="";
       if($(this).find("#room_id_left").length>0){
         name="room";
         name2="user";
         value=$(this).find("#"+name+"_id_left").text().trim();
         var room_id=$("#room_id").val();
         if(value==room_id){
           return false;
         }
       }else{
         name="user";
         name2="room";
         value=$(this).find("#"+name+"_id_left").text().trim();
       }
       $("#get_room_form").find("[name='"+name+"']").val(value);
       $("#get_room_form").find("[name='"+name2+"']").val("");
       $("#get_room").click();
     });
     $(document).on('click','.row.message-body',function(){
       $(this).find(".message-time.col-sm-12").toggleClass("hidden");
     });

  });
});


function webrtc(room_id){
  peer=document.peer;
  var room=peer.joinRoom(room_id,{mode:"sfu",stream:null});
  room.on('open',function(){

    $("#start_tell").click(function(){
      navigator.mediaDevices.getUserMedia({video:false, audio:true }).then(function(stream){
        document.stream=stream;
        room.replaceStream(stream);
      });
    });

    room.on("stream",function(stream){
      stream_to_tag(stream);
      if(!document.stream){
        navigator.mediaDevices.getUserMedia({video:false, audio:true }).then(function(stream){
          document.stream=stream;
          room.replaceStream(stream);
        });
      }
    });


    $("#comment").keydown(function(e){
      if ( e.keyCode !== 13 || ( e.keyCode === 13 && (e.shiftKey === true || e.ctrlKey === true || e.altKey === true) )) { // Enterキー除外
        return true;
      }
      var message=$("#comment").val();
      $("#comment").val("");

      if(message.length>0){
        var my_id=$("#my_user_id").val();
        var room_id=$("#room_id").val();
        var time=getNowHHMM();
        var my_name=$("#my_name").val();

        $("#get_chat_form").find("[name='user_id']").val(my_id);
        $("#get_chat_form").find("[name='content']").val(message);
        $("#get_chat_form").find("[name='room_id']").val(room_id);
        $("#get_chat").click();

        room.send({label:"message",data:{user_name:my_name,room_id:room_id,time:time,message:message}});

        $send_temp=$("#chat_template_sender").children().clone();
        $send_temp.find(".message-text").html(message.replace(/\r?\n/g, "<br>"));
        $send_temp.find(".message-time").text(time);

        $("#conversation").append($send_temp);
        $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');
        return false;
      }
    });
    room.on("data",function(data){
      if (data.data.label=="message") {
        var message=data.data.data.message;
        var time=data.data.data.time;
        var user_name=data.data.data.user_name;

        $re_temp=$("#chat_template_receiver").children().clone();
        $re_temp.find(".message-text").html(message.replace(/\r?\n/g, "<br>"));
        $re_temp.find(".message-time").text(time);
        $re_temp.find(".chat_name").text(user_name);
        $("#conversation").append($re_temp);
        $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');
      }
    });
  });
}

function getNowHHMM(){
  var now= new Date();
  var hour = ("0"+now.getHours()).slice(-2);
  var minute = ("0"+now.getMinutes()).slice(-2);
  return hour+":"+minute;
}

function stream_to_tag(stream){
  if($("audio#"+stream.peerId).length==0){
    $audio=$("<audio>");
    $("body").append($audio);
    $audio.attr("src",window.URL.createObjectURL(stream));
    $audio.attr("id",stream.peerId);
    $audio.attr("autoplay",true);
  }else{
    $("audio#"+stream.peerId).attr("src",window.URL.createObjectURL(stream));
  }
}
