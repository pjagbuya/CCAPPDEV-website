$(document).ready(function(){
  const socket = io();

  socket.on('recieve-message', function(data){
    displayRecieveMessage(data);
  })

  $('#direct-message-type-send').click(function(){
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

  $('#direct-message-type-send').on('keypress',function(e){
    if(e.which == 13){
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
    }//if
  });//enter

  $('#direct-message-header-exit').click(function(){
    $('#direct-message-header-pic').empty();
    $('#direct-message-body').empty();
    $('#direct-message-type').val('');
    changeTab('direct-message','chatlist');
  });

  for(let i = 0; i < rooms.size(); i++){
    $('#chatbox-container'+i).click(function(){
      $.post('chat-connect',
        { roomid: $('#chatbox-container'+i).name() },
        function(data, status){
          if(status === 'success'){
            //connect to that room, transfer to chatroom.hbs
            for(let j = 0; j < data.chats.size(); j++){
              if(data.dlsuID == data.chats[j].dlsuID){
                displaySentMessage(data.chats[j])
              }
              else{
                displayRecieveMessage(data.chats[j])
              }
            }
            $('#direct-message-header-pic').append('<img src="'+ data.imageSource +'" class="direct-message-item">');
            $('#direct-message-header-name').html(data.username);
            changeTab('chatlist','direct-message');
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

function changeTab(old_div_id,new_div_id){
  div1 = document.getElementById(old_div_id);
  div2 = document.getElementById(new_div_id);
  div1.style.display = "none";
  div2.style.display = "block";
}