$(document).ready(function(){
  const socket = io();

  socket.on("connect", function(){
    displayRecieveMessage(`You connected with id: ${socket.id}`);
  });

  socket.on("send-message", function(data){
    console.log(`user ${socket.id} sent message`);
    socket.broadcast.emit("recieve-message", data);
  })

  socket.on("recieve-message", function(data){
    console.log(`user ${socket.id} got message`);
    displayRecieveMessage(data.message);
  })

  $("#msg-btn").click(function(){
    $.post('chat-send',
      { msg: $('#msg-txt').val() },
      function(data, status){
        if(status === 'success'){
          socket.emit("send-message", {message: data.message});
          displaySentMessage(data.message);
          $('#msg-txt').val('');
        }//if
      });//fn+post
  });//btn
});

function displaySentMessage(message){
  $('#message-area').append('<tr><td class="sent-td"><span class="sent-span">'+message+'</span></td></tr>');
}

function displayRecieveMessage(message){
  $('#message-area').append('<tr><td><span class="recieve-span">'+message+'</span></td></tr>');
}