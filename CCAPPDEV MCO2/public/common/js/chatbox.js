$(document).ready(function(){
  const socket = io();

  socket.on("connect", function(){

  });

  socket.on("send-message", function(data){
    socket.broadcast.emit("recieve-message", data);
    //save in database
  })

  socket.on("recieve-message", function(data){
    
    displayRecieveMessage(data);
  })

  $("#direct-message-type-send").click(function(){
    $.post('chat-send',
      { message: $('#direct-message-type').val(), 
        roomId: $('#direct-message').name},
      function(data, status){
        if(status === 'success'){
          socket.emit("send-message", 
            {
              message: data.message, 
              roomID: data.roomID, 
              dlsuID: data.dlsuID, 
              imageSource: data.imageSource, 
              username: data.username
            });
          displaySentMessage(data);
          $('#direct-message-type').val('');
        }//if
      });//fn+post
  });//btn

  $("#direct-message-header-exit").click(function(){
    //switch back to chatbox.hbs
  });

  for(let i = 0; i < rooms.size(); i++){
    $("#chat"+i).click(function(){
      $.post('chat-connect',
        { roomid: $('#chatbox-container'+i).name() },
        function(data, status){
          if(status === 'success'){
            //connect to that room, transfer to chatroom.hbs
          }//if
        });//fn+post
    });//btn

  }
});

function displaySentMessage(data){
  var chatObject = '<div class="direct-message-recieve"><div class="direct-message-body-message">'+data.message+'</div><div class="direct-message-body-pic"><img src="'+data.imageSource+'" class="direct-message-item"></div></div>'
  $('direct-message-body').append(chatObject);
}

function displayRecieveMessage(){
  var chatObject = '<div class="direct-message-send"><div class="direct-message-body-pic"><img src="'+data.imageSource+'" class="direct-message-item"></div><div class="direct-message-body-message">'+data.message+'</div></div>'
  $('direct-message-body').append(chatObject);
  
}