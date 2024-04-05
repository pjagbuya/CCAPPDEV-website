$(document).ready(function(){

  const socket = io();

  socket.on('recieve-message', function(data){
    displayRecieveMessage(data);
    $('#chatbox-chat'+data.index).html(messageWhenTooLong(data.userName + ': ' + data.message));
  })

  $('#chat-open-btn').click(function(){
    if($("#chatbox").css("display") === "none")
    {
      $.post('chat-open', 
        {
          dlsuID: $('#profile-section').attr('name')
        },
        function(data, status)
        {
          if(status === 'success')
          {
            for(let i = 0; i < data.rooms.length; i++){

              var roomName = ''
              var imageSource = ''

              if(data.rooms[i].roomDetails[0].dlsuID != data.dlsuID)
              {
                roomName = data.rooms[i].roomDetails[0].userName
                imageSource = data.rooms[i].roomDetails[0].imageSource
              }
              else
              {
                roomName = data.rooms[i].roomDetails[1].userName
                imageSource = data.rooms[i].roomDetails[1].imageSource
              }

              var roomData = {
                index: i,
                roomID : data.rooms[i].roomID,
                roomName : roomName,
                imageSource : imageSource,
                lastMessage: messageWhenTooLong(getLastMessage(data.chats, data.rooms[i].roomID))
              }

              displayChatContainer(roomData);
            }//for
          }//if
        }//fn
      );//post
      $("#chatbox").css("display", "block");
    }//if
    else
    {
      for(let i = 0; i < 20; i++){
        removeChatContainer(i)
      }
      
      $("#chatbox").css("display", "none");
    }//else
  });//btn

  $('#direct-message-type-send').click(function(){
    $.post('chat-send',
      { 
        message: $('#direct-message-type').val(), 
        roomID: $('#direct-message').attr('name'),
        dlsuID: $('#profile-section').attr('name'),
        imageSource: $('#profile-section-pic').attr('name'),
        index: $('#direct-message-header').attr('name')
      },
      function(data, status)
      {
        if(status === 'success')
        {
          socket.emit("send-message", 
            {
              chatOrder: data.chatOrder,
              message: data.message, 
              roomID: data.roomID, 
              dlsuID: data.dlsuID, 
              imageSource: data.imageSource, 
              userName: data.userName,
              index: data.index
            }
          );
          displaySentMessage(data);
          $('#direct-message-type').val('');
          $('#chatbox-chat'+data.index).html(messageWhenTooLong(data.userName + ': ' + data.message));
        }//if
      }//fn
    );//post
  });//btn

  $('#direct-message-header-exit').click(function(){
    $.post('chat-leave',
      {
        roomID: $('#direct-message').attr('name')
      }, 
      function(data, status)
      {
        if(status === 'success')
        {
          $('#direct-message').attr('name', 'none')
          $('#direct-message-header').attr('name', 'none')
          $('#direct-message-header-pic').empty();
          $('#direct-message-body').empty();
          $('#direct-message-type').val('');
          changeTab('direct-message','chatlist');
          socket.emit("leave-room", data.roomID); 
        }//status
      }//fn
    );//post
  });//btn

  for(let i = 0; i < 20; i++){
    $('#chatbox-container' + i).click(function(){

      $.post('chat-connect',
        { 
          roomID: $('#chatbox-container'+i).attr('name'),
          roomName: $('#chatbox-chatname'+i).attr('name'),
          imageSource: $('#chatbox-profilePic'+i).attr('name'),
          dlsuID: $('#profile-section').attr('name'),
          index: $('#chatbox-chatContainer'+i).attr('name')
        },
        function(data, status)
        {
          if(status === 'success')
          {
            for(let j = 0; j < data.chatOrder; j++)
            {
              if(data.dlsuID == data.chats[j].dlsuID)
              {
                displaySentMessage(data.chats[j])
              }
              else
              {
                displayRecieveMessage(data.chats[j])
              }
            }
            $('#direct-message-header-pic').append('<img src="'+ data.imageSource +'" class="direct-message-item">');
            $('#direct-message-header-name').html(data.roomName);
            $('#direct-message').attr('name', data.roomID);
            $('#direct-message-header').attr('name', data.index);
            socket.emit("join-room", data.roomID);
            changeTab('chatlist','direct-message');
          }//if
        }//fn
      );//post
    });//btn
  }//for

});

function displaySentMessage(data)
{
  var chatObject = '<div class="direct-message-recieve"><div class="direct-message-body-message">'+data.message+'</div><div class="direct-message-body-pic"><img src="'+data.imageSource+'" class="direct-message-item"></div></div>'
  $('#direct-message-body').append(chatObject);
}

function displayRecieveMessage(data)
{
  var chatObject = '<div class="direct-message-send"><div class="direct-message-body-pic"><img src="'+data.imageSource+'" class="direct-message-item"></div><div class="direct-message-body-message">'+data.message+'</div></div>'
  $('#direct-message-body').append(chatObject);
}

function displayChatContainer(data)
{

  $('#chatbox-profilePic-pic' + data.index).attr('src', data.imageSource);
  $('#chatbox-profilePic' + data.index).attr('name', data.imageSource);

  $('#chatbox-chatname' + data.index).html(data.roomName);
  $('#chatbox-chatname' + data.index).attr('name', data.roomName);

  $('#chatbox-chat' + data.index).html(messageWhenTooLong(data.lastMessage));

  $('#chatbox-container' + data.index).attr('name', data.roomID);
  $('#chatbox-container' + data.index).css('display', 'flex');

}

function removeChatContainer(index){

  $('#chatbox-profilePic-pic' + index).attr('src', '');
  $('#chatbox-profilePic' + index).attr('name', 'none');

  $('#chatbox-chatname' + index).empty();
  $('#chatbox-chatname' + index).attr('name', 'none');

  $('#chatbox-chat' + index).empty();

  $('#chatbox-container' + index).attr('name', 'none');
  $('#chatbox-container' + index).css('display', 'none');

}

function getLastMessage(data, roomID){
  var list = [];
  for(let i = 0; i < data.length; i++)
  {
    if(data[i].roomID === roomID)
    {
      list.push(data[i]);
    }
  }
  if(list.length > 0)
  {
    return (list[list.length-1].userName +": "+ list[list.length-1].message);
  }
  else
  {
    return ("Begin Chat! Press Me!")
  }
  
}

function messageWhenTooLong(str){
  return (str.length > 22) ? str.slice(0, 22-1) + '&hellip;' : str;
};

function changeTab(old_div_id,new_div_id)
{
  div1 = document.getElementById(old_div_id);
  div2 = document.getElementById(new_div_id);
  div1.style.display = "none";
  div2.style.display = "block";
}