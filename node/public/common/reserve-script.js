

document.addEventListener("DOMContentLoaded", function() {


  function openModalSeats() {
    document.getElementById('modalSeats').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('room-container').style.display = 'flex';
  }

  function closeModalSeats() {
    document.getElementById('modalSeats').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('room-container').style.display = 'none';
  }

  $("#toggleSidebar").on("click", function () {
    $(".hidden-sidebar").toggleClass("show");
  });

  function showSelectSeat() {

    document.getElementById('selectSeatsSection').style.display = 'flex';

  }
  function showTimeTable() {

    document.getElementById('timeTableSection').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    document.querySelector('footer').style.justifyContent = 'center';


  }

  function copySelected(seatBox) {
    var sourceText = seatBox.innerText;
    document.querySelector('.selected-seat-text').innerText = sourceText;
  }

  function copySelectedToCheck(checkboxElement, tableCell) {

    var sourceText = document.querySelector('.selected-seat-text').innerText
    if (checkboxElement.checked && sourceText != 'N/A') {
      document.querySelector(tableCell).innerText = sourceText;
    } else {
      document.querySelector('.${tableCell}').innerText = 'X';
    }


  }






  var toggleSidebar = document.getElementById("toggleSidebar");

  toggleSidebar.addEventListener("click", function (e) {
    e.preventDefault(); // Allows for asynchronous loading and actions, remember this
    var hiddenSidebar = document.querySelector(".hidden-sidebar");
    hiddenSidebar.classList.toggle("show");
  });
  // Get all seat-box elements
  var seatBoxes = document.querySelectorAll('.seat-box');

  // Add function to send seat number selected
  seatBoxes.forEach(function(seatBox) {
    seatBox.addEventListener('click', function() {
      copySelected(seatBox);
      closeModalSeats();
      showTimeTable();
    });
  });

  function generateTimeSlotTable(tableId, timeName, startTime, endTime) {
    const table = document.getElementById(tableId).querySelector('tbody');
    var data_count = 0;
    var row;

    for (let minutes = startTime * 60; minutes < endTime * 60; minutes += 30) {
      const hourStart = Math.floor(minutes / 60);
      const minuteStart = minutes % 60;
      const hourEnd = Math.floor((minutes + 30) / 60);
      const minuteEnd = (minutes + 30) % 60;


      const timeSlot = `${hourStart}:${minuteStart === 0 ? '00' : minuteStart} - ${hourEnd}:${minuteEnd === 0 ? '00' : minuteEnd}`;

      // Hardcoded time slot block
      if (data_count == 6 && timeName == "morning") {
        row = `<tr>
                          <td class="time-slot-data ${timeName}-time-slot-${data_count}">${timeSlot}</td>
                          <td class="checkbox-data ${timeName}-checkbox-slot-${data_count}" >X</td>
                          <td class="seat-num-data ${timeName}-seat-slot-${data_count}">X</td>

                       </tr>`;
      }

      else if (data_count == 8 && timeName == "morning") {
        row = `        <tr>
                          <td class="time-slot-data ${timeName}-time-slot-${data_count}">${timeSlot}</td>
                          <td class="checkbox-data ${timeName}-checkbox-slot-${data_count}" >
                            <a class="taken-slot-text " data-toggle="tooltip" data-placement="top" title="Taken by ID 12206660" href="../profile/profile-other-user.html">
                              <u>TAKEN</u>
                            </a>
                          </td>
                          <td class="seat-num-data ${timeName}-seat-slot-${data_count}">24</td>

                       </tr>`;
      }

      else if (data_count == 4 && timeName == "afternoon") {
        row = `        <tr>
                          <td class="time-slot-data ${timeName}-time-slot-${data_count}">${timeSlot}</td>
                          <td class="checkbox-data ${timeName}-checkbox-slot-${data_count}" >
                            <div class="taken-slot-text" data-toggle="tooltip" data-placement="top" title="Taken by ID ???">
                              <u>TAKEN</u>
                            </div>
                          </td>
                          <td class="seat-num-data ${timeName}-seat-slot-${data_count}">25</td>

                       </tr>`;
      }
      else {
        row = `<tr>
                          <td class="time-slot-data ${timeName}-time-slot-${data_count}">${timeSlot}</td>
                          <td class="checkbox-data ${timeName}-checkbox-slot-${data_count}" ><input onclick='copySelectedToCheck(this, ".${timeName}-seat-slot-${data_count}")' type="checkbox"></td>
                          <td class="seat-num-data ${timeName}-seat-slot-${data_count}">X</td>
                       </tr>`;
      }

      data_count += 1;


      table.innerHTML += row;
    }
  }

  generateTimeSlotTable("morningTable", "morning", 7, 12);


  generateTimeSlotTable("afternoonTable", "afternoon", 12, 17);


  // Function to create dates
let selectedDayDiv = null;
  function createDates() {
    return new Promise((resolve, reject) => {
      const currentDate = new Date();
      const daysContainer = document.getElementById("daysContainer");

      for (let i = 0; i < 8; i++) {
        const day = new Date();
        day.setDate(currentDate.getDate() + i);

        const options = {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        };
        const formattedDate = day.toLocaleDateString('en-US', options);

        const dayDiv = document.createElement("div");
        dayDiv.className = "day";

        const formattedDateElement = document.createElement("div");
        formattedDateElement.className = "format-date";
        formattedDateElement.textContent = formattedDate;

        dayDiv.appendChild(formattedDateElement);

        dayDiv.addEventListener("click", function() {
          const dayDataToSend = {
            day: day.toLocaleDateString('en-US', { weekday: 'long' }),
          };
          document.getElementById('selectSeatsSection').style.display = 'flex';
          if (selectedDayDiv) {
            selectedDayDiv.style.backgroundColor = "white";
          }
          handleDayDivClick(dayDataToSend);

          this.style.backgroundColor = "#ADBC9F";
          selectedDayDiv = this;
        });

        daysContainer.appendChild(dayDiv);
      }
    });
  }
  // Function to post data
  function postSeatData(weekDay, seatNumber) {
    return new Promise((resolve, reject) => {
      const techID = document.getElementById('techIDInput').value;
      const userID = document.getElementById('userIDInput').value;
      const labName = document.getElementById('labNameInput').value;
      console.log("Selected Day: " + weekDay);
      console.log("labName:", labName);
      console.log("seatNumber:", seatNumber);

      $.ajax({
        url: `/lt-user/${techID}/reserve/seat`,
        type: 'POST',
        data: {
          weekDay: String(weekDay),
          labName: String(labName),
          seatNumber: String(seatNumber)
        },
        success: function (result, status) {
          console.log('Request successfully sent:', status);
          resolve({
            dataM: result.dataM,
            dataN: result.dataN
          });
        },
        error: function (error) {
          console.error('Error in AJAX request:', error);
          reject(error);
        }
      });
    });
  }
  // Function to post data
  function postData(weekDay) {
    return new Promise((resolve, reject) => {
      const techID = document.getElementById('techIDInput').value;
      const userID = document.getElementById('userIDInput').value;
      const labName = document.getElementById('labNameInput').value;
      console.log("Selected Day: " + weekDay);

      $.ajax({
        url: `/lt-user/${techID}/reserve/${userID}/${labName}`,
        type: 'POST',
        data: weekDay,
        success: function (result, status) {
          resolve(result.data);
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  }
  function organizeSeatsIntoBlocks(seats) {
    const organizedBlocks = [];

    // Iterate over the seats, creating blocks of 4 seats each
    for (let i = 0; i < seats.length; i += 4) {
      const groupNumber = Math.floor(i / 4) + 1;
      const block = seats.slice(i, i + 4);

      // If the block is incomplete, pad it with null values
      while (block.length < 4) {
        block.push(null);
      }

      // Attach seatNumber key to each seat in the block
      const seatsWithSeatNumber = block.map((seat, index) => ({
        seatNumber: i + index + 1,
        seat
      }));

      const groupObject = {
        group: groupNumber,
        seats: seatsWithSeatNumber
      };

      organizedBlocks.push(groupObject);
    }

    return organizedBlocks;
  }

  Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });



  function handleDayDivClick(dayDataToSend) {
    $('#modalSeats').empty();
    postData(dayDataToSend)
      .then(data => {
        console.log('Server response:', data);

        const array = data;
        const templateData = organizeSeatsIntoBlocks(array)



        console.log(templateData)
        // Handlebars.registerHelper('eq', function (a, b, options) {
        //   return a === b ? options.fn(this) : options.inverse(this);
        // });
        let profileTemplateString = document.getElementById("my-template").innerHTML;
        let renderProfile = Handlebars.compile(profileTemplateString);

        const templateSource = document.getElementById('my-template').innerHTML;
        console.log("Compiling: " + templateSource);
        const template = Handlebars.compile(templateSource);

        let renderedProfile =  renderProfile({data:templateData,
        helpers: {
          eq: function (a, b, options) {
             return a === b ? options.fn(this) : options.inverse(this);
           }
        }});
        console.log("renderedProfile below: "+ renderedProfile);
        $('#modalSeats').append(renderedProfile);

          document.getElementById('selectSeatButton').addEventListener("click", function(){
            document.getElementById('modalSeats').style.display = 'flex';
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('room-container').style.display = 'flex';

          });

        $("#overlay").on("click", function () {
          closeModalSeats();
        });
        $("#seatXBtn").on("click", function () {
          closeModalSeats();
        });
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        let selectedNum = "";

        document.getElementById('selectSeatButton').addEventListener("click", openModalSeats);

        var seatBoxes = document.querySelectorAll('.seat-box');


        seatBoxes.forEach(function(seatBox) {
          var seatNumber = seatBox.textContent.trim();

          var dateText = selectedDayDiv.textContent.trim();


          var weekDay = dateText.split(',')[0].trim();
          seatBox.addEventListener('click', function() {
            copySelected(seatBox);
            closeModalSeats();
            showTimeTable();
            postSeatData(weekDay, seatNumber)
                .then(data => {
                    console.log('Server response in seat Times and seats:', data.dataM);
                    console.log('Server response in seat Times and seats:', data.dataN);
                  });
          });
        });
      });
  }

  createDates();
});
