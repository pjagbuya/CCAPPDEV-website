document.addEventListener("DOMContentLoaded", function () {
  console.log("WOOO LOADED JS")



  function openModal() {

    document.getElementById('selectRoomModal').style.display = 'flex';
    document.getElementById('modalOverlay').style.display = 'block';
  }

  function closeModal() {

    document.getElementById('selectRoomModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
  }






  var toggleSidebar = document.getElementById("toggleSidebar");

  toggleSidebar.addEventListener("click", function (e) {
    e.preventDefault(); // Allows for asynchronous loading and actions, remember this
    var hiddenSidebar = document.querySelector(".hidden-sidebar");
    hiddenSidebar.classList.toggle("show");
  });






});

$(document).ready(function(){
  $('#logout-btn').click(function(){
    $.post('logout',
      { 
        rememberMe: $('#is-remember').prop('checked')
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
  });
});