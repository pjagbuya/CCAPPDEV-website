$(document).ready(function(){
  const socket = io();

  socket.on("connect", function(){
    displayRecieveMessage(`You connected with id: ${socket.id}`);
  });

  socket.on("send-message", function(data){
    socket.broadcast.emit("recieve-message", data);
  })

  socket.on("recieve-message", function(data){
    displayRecieveMessage(socket.id + " sent: " + data.message);
  })

  $("#msg-btn").click(function(){
    $.post('chat-send',
      { msg: $('#msg-txt').val() },
      function(data, status){
        if(status === 'success'){
          socket.emit("send-message", {message: data.message, id: socket.id});
          displaySentMessage(data.message);
          $('#msg-txt').val('');
        }//if
      });//fn+post
  });//btn

  for(let i = 0; i < 10; i++){
    $("#chat"+i).click(function(){
      $.post('chat-send',
        { roomid: $('#msg-txt').name() },
        function(data, status){
          if(status === 'success'){
            socket.emit("send-message", {message: data.message, id: socket.id});
            displaySentMessage(data.message);
            $('#msg-txt').val('');
          }//if
        });//fn+post
    });//btn

  }
});