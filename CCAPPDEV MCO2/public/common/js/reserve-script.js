

document.addEventListener("DOMContentLoaded", function() {

  const checkedSeatIds = [];
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








  var toggleSidebar = document.getElementById("toggleSidebar");

  toggleSidebar.addEventListener("click", function (e) {
    e.preventDefault(); // Allows for asynchronous loading and actions, remember this
    var hiddenSidebar = document.querySelector(".hidden-sidebar");
    hiddenSidebar.classList.toggle("show");
  });


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

  function postReservationData(seatSlots) {


    const techID = document.getElementById('techIDInput').value;
    const userID = document.getElementById('userIDInput').value;
    const labName = document.getElementById('labNameInput').value;
    console.log("Data being sent:", {
      userID: String(userID),
      labName: String(labName),
      seatSlots: seatSlots
    });

      $.ajax({
        url: `/lt-user/${techID}/reserve/confirm`,
        type: 'POST',
        data: {
          userID: String(userID),
          labName: String(labName),
          seatSlots: seatSlots
        },
        function (result, status) {
          console.log('Request reservation successfully sent:', status);
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
  function copySelectSeatSlots(button) {
    console.log("confirmation modal opened");

    const $modal = $('.modal-body');
    const modalTableBody = $modal.find('table tbody');

    // Search both tables
    const tables = $('#morningTable, #afternoonTable');
    modalTableBody.empty();

    tables.find('.time-chkBox:checked').each(function() {
      const $checkbox = $(this);
      const $row = $checkbox.closest('tr');

      console.log("Finding Checkboxes");

      const timeInterval = $row.find('.time-slot-data').text().trim();
      const seatNumber = $row.find('.seat-num-data').text().trim();

      modalTableBody.append(`
        <tr>
          <td class="tc">${timeInterval}</td>
          <td class="tc">${seatNumber}</td>
        </tr>
      `);
    });
  }


  function handleDayDivClick(dayDataToSend) {
    $('#modalSeats').empty();
    $('#timeTableSection').empty();
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
            $('#timeTableSection').empty();
            copySelected(seatBox);

            closeModalSeats();
            showTimeTable();
            postSeatData(weekDay, seatNumber)
                .then(data => {

                    console.log('Server response in seat Times and seats:', data.dataM);
                    console.log('Server response in seat Times and seats:', data.dataN);
                    let profileTemplateString = document.getElementById("time-template").innerHTML;
                    let renderProfile = Handlebars.compile(profileTemplateString);

                    const templateSource = document.getElementById('time-template').innerHTML;
                    console.log("Compiling: " + templateSource);
                    const template = Handlebars.compile(templateSource);
                    Handlebars.registerHelper('isNull', function(user, options) {
                      return user === null ? options.fn(this) : options.inverse(this);;
                    });
                    let renderedProfile =  renderProfile({
                    dataM:data.dataM,
                    dataN:data.dataN ,
                    helpers: {
                      eq: function (a, b, options) {
                         return a === b ? options.fn(this) : options.inverse(this);
                       },
                       isNull: function(user, options) {
                                        return user === null ? options.fn(this) : options.inverse(this);
                                      }
                    }});

                    $('#timeTableSection').append(renderedProfile);

                    function copySelectedToCheck(checkboxElement, tableCell) {


                      var sourceText = $('.selected-seat-text').text();
                      console.log("Source text is visibly: " + sourceText);


                      if (sourceText === 'N/A') {
                        sourceText = 'X';
                      }

                      if (checkboxElement.checked && sourceText != 'N/A') {
                        document.getElementById(tableCell).innerText = sourceText;
                      } else {
                        document.getElementById(tableCell).innerText = 'X';
                      }


                    }

                    const labName = document.getElementById('labNameInput').value;
                    $('.time-chkBox').on('change', function() {
                      var seatTimeID = $(this).data('id-toggler');


                      copySelectedToCheck(this, seatTimeID);

                      const seatId = event.target.dataset.seatId;
                      if (event.target.checked) {
                        checkedSeatIds.push(seatId);
                      } else {
                        const index = checkedSeatIds.indexOf(seatId);
                        if (index !== -1) {
                          checkedSeatIds.splice(index, 1);
                        }
                      }


                    });
                    $('#confirmationModal').on('shown.bs.modal', function() {


                        $('#confirmation-labName').text(labName);
                        copySelectSeatSlots($('.confirm-reservation-btn'))
                        $('#confirmModalBtn').on('click', function() {
                          postReservationData(checkedSeatIds);
                        });
                    });





                  });
          });
        });
      });
  }

  createDates();
});
