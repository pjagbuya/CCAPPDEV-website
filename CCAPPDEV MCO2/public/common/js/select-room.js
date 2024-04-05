document.addEventListener("DOMContentLoaded", function () {

  var selectRoomBtn = document.getElementsByClassName("custom-btn-1")[1];
  selectRoomBtn.addEventListener("click", function(e){

      e.preventDefault();
      document.getElementById('selectRoomModal').style.display = 'flex';
      document.getElementById('modalOverlay').style.display = 'block';

  });

  var overlay = document.getElementById("modalOverlay");
  overlay.addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById('selectRoomModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
  });
  var selectedExitBtn = document.getElementsByClassName("x-button-align-section")[0];
  selectedExitBtn.addEventListener("click", function(e){
      e.preventDefault();

      document.getElementById('selectRoomModal').style.display = 'none';
      document.getElementById('modalOverlay').style.display = 'none';

  });

  function populateFromTimeOptions() {
    var startTime = new Date();
    startTime.setHours(7, 30, 0); // Set start time to 7:30 AM

    var endTime = new Date();
    endTime.setHours(17, 0, 0); // Set end time to 5:00 PM

    var interval = 30 * 60 * 1000; // 30 minutes in milliseconds

    var selectElement = document.getElementById("fromTime");

    for (var time = startTime.getTime(); time <= endTime.getTime(); time += interval) {
      var option = document.createElement("option");
      var timeString = new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      option.value = timeString;
      option.text = timeString;
      selectElement.add(option);
    }
  }


  function populateToTimeOptions() {
    var startTime = new Date();
    startTime.setHours(8, 0, 0); // Set start time to 8:00 AM

    var endTime = new Date();
    endTime.setHours(17, 30, 0); // Set end time to 5:30 PM

    var interval = 30 * 60 * 1000; // 30 minutes in milliseconds

    var selectElement = document.getElementById("toTime");

    for (var time = startTime.getTime(); time <= endTime.getTime(); time += interval) {
      var option = document.createElement("option");
      var timeString = new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      option.value = timeString;
      option.text = timeString;
      selectElement.add(option);
    }
  }
  function populateDateOptions() {
    var selectRoom = document.getElementById('inputRoom');


    var currentDate = new Date();

    for (var i = 0; i < 8; i++) {

      var nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);


      var month = nextDate.toLocaleString('default', { month: 'long' });
      var day = nextDate.getDate();
      var weekday = nextDate.toLocaleString('en', { weekday: 'long' });


      var option = document.createElement('option');
      option.value = nextDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
      option.text = `${weekday}, ${month} ${day}`;


      selectRoom.appendChild(option);
    }
  }
  const reserveButtons = document.querySelectorAll('.selectBtn-LT-Reserve');

  reserveButtons.forEach(button => {
    button.addEventListener('click', function() {

      const labName = this.getAttribute('data-labname');


      const roomNameElement = document.getElementById('roomName');


      roomNameElement.textContent = labName;
      document.getElementById('selectRoomModal').style.display = 'none';
      document.getElementById('modalOverlay').style.display = 'none';
    });
  });
  var divs = document.querySelectorAll(".lab-choice-section");

  divs.forEach(function (div) {
    var availabilityText = div.querySelector(".status-text");
    var currentLabDetail = div.querySelector(".lab-choice-details");

    if (availabilityText) {
      var textColor = window.getComputedStyle(availabilityText).color;

      if (textColor === "rgb(255, 0, 0)" || textColor === "red") {
        currentLabDetail.style.backgroundColor = "orange";
      }
    }
  });

  populateFromTimeOptions();
  populateToTimeOptions();
  populateDateOptions();
});
