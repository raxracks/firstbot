function logout() {
  window.location.href = "https://multi-bot.glitch.me";
}
function reconstruct() {
  $(".user-body").html("<h1 class=\"user-title user-blurple\">Name of the channel: </h1><br><textarea id=\"channelReconstruct\"></textarea>");
  $("#channelReconstruct").on("keypress", function(e){
    if (e.which === 13) {
     $.ajax({url: `/dashboard/api/reconstruct?channel=${$("#channelReconstruct").val()}`, success: function(body){
       $(".user-body").html(body);
     }});
    }
  });
}
function currentlyPlaying() {
 $(".user-body").html("<h1 class=\"user-title user-blurple\">Name of the guild: </h1><br><textarea id=\"guildCurrentlyPlaying\"></textarea>");
  $("#guildCurrentlyPlaying").on("keypress", function(e){
    if (e.which === 13) {
     $.ajax({url: `/dashboard/api/music/current?guild=${$("#guildCurrentlyPlaying").val()}`, success: function(body){
       $(".user-body").html(body);
     }});
    }
  }); 
}
function stopMusic() {
 $(".user-body").html("<h1 class=\"user-title user-blurple\">Name of the guild: </h1><br><textarea id=\"guildStopMusic\"></textarea>");
  $("#guildStopMusic").on("keypress", function(e){
    if (e.which === 13) {
     $.ajax({url: `/dashboard/api/music/stop?guild=${$("#guildStopMusic").val()}`, success: function(body){
       $(".user-body").html(body);
     }});
    }
  }); 
}