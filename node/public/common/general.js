document.addEventListener("DOMContentLoaded", function () {
  var toggleSidebar = document.getElementById("toggleSidebar");

  toggleSidebar.addEventListener("click", function (e) {
    e.preventDefault(); // Allows for asynchronous loading and actions, remember this
    var hiddenSidebar = document.querySelector(".hidden-sidebar");
    hiddenSidebar.classList.toggle("show");
  });

  const currentDate = new Date();

  const daysContainer = $("#daysContainer");

  for (let i = 0; i < 8; i++) {
    const day = new Date();
    var reservation = ""



    // Hard-coded reservation for the second day
    if (i === 1) {
       reservation = "<div class='date-details'><p class='text-decoration-underline'> GK304B  </p><p>(Seat 32)</p>  <p>7:30 A.M - 8:00 A.M</p> </div>" +

       "<div class='date-details'><p class='text-decoration-underline'> GK304B  </p><p>(Seat 32)</p>  <p>8:00 A.M - 8:30 A.M</p></div>";

     }
     else if (i === 4) {
        reservation = "<div class='date-details'><p class='text-decoration-underline'> GK302A  </p><p>(Seat 16)</p>  <p>10:30 A.M - 11:00 A.M</p> </div>" +

        "<div class='date-details'><p class='text-decoration-underline'> GK302A  </p><p>(Seat 16)</p>  <p>11:00 A.M - 11:30 A.M</p></div>";

      }

      else if (i === 7) {
         reservation = "<div class='date-details'><p class='text-decoration-underline'> GK306B  </p><p>(Seat 20)</p>  <p>2:30 P.M - 3:00 P.M</p></div>";

       }

     day.setDate(currentDate.getDate() + i);

     const options = { weekday: 'short', month: 'short', day: 'numeric' };
     const formattedDate = day.toLocaleDateString('en-US', options);

     const dayDiv = document.createElement("div");
     dayDiv.className = "day";


     const formattedDateElement = document.createElement("div");
     formattedDateElement.className = "format-date";
     formattedDateElement.textContent = formattedDate;

     dayDiv.appendChild(formattedDateElement);
     dayDiv.innerHTML += reservation;

     daysContainer.append(dayDiv);
  }



  document.addEventListener("DOMContentLoaded", function () {
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


  populateFromTimeOptions();
  populateToTimeOptions();
  populateDateOptions()
});
