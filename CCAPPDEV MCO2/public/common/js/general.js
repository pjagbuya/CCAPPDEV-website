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


  $('.logout-div-btn').click(function(event) {
    event.preventDefault(); // Prevent default behavior (likely a link or button)

    $.post('/logout', function(data, status) {
      if (status === 'success') {

        window.location.href = '/login'; // Or your desired login page URL

      } else {

        console.error("Error:", data);
        alert("An error occurred while logging out. Please try again.");
      }
    });
  });



});
