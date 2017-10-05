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

 // $("#hogehoge").keydown(function(e){
 //
 // });

$(function(){
  $('#conversation').animate({scrollTop: $('#conversation')[0].scrollHeight}, 'fast');

  $('.row.sideBar-body').on('click',function(){
     $(this).addClass("sideBar-active");
     $(this).siblings().removeClass("sideBar-active");

   });

   $(document).on('click','.row.message-body',function(){
      $(this).find(".message-time.col-sm-12").toggleClass("hidden");
    });

  $("#comment").keydown(function(e){
    if(!send_message(e)){
      return false;
    }
  });
});


function send_message(e) {
  if ( e.keyCode !== 13 || ( e.keyCode === 13 && (e.shiftKey === true || e.ctrlKey === true || e.altKey === true) )) { // Enterキー除外
    return true;
  }
  message=$("#comment").val();
  $("#comment").val("");
  if(message.length>0){

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
