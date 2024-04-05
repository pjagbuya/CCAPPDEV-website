function delayedFunction() {
  var selectElement = $('.inputWeekDay');
  var currentDate = new Date();

  for (var i = 0; i < 8; i++) {
    var nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);

    var month = nextDate.toLocaleString('default', { month: 'long' });
    var day = nextDate.getDate();
    var weekday = nextDate.toLocaleString('en', { weekday: 'long' });

    var option = $(`<option data-weekDay="${weekday}"></option>`);
    option.val(nextDate.toISOString().slice(0, 10));
    option.text(`${weekday}, ${month} ${day}`);

    selectElement.append(option);
  }

  const selectWeekDayInput = document.querySelectorAll('.inputWeekDay');
  selectWeekDayInput.forEach(function(selectElement) {
    selectElement.addEventListener('change', function(event) {
      const selectedOption = event.target.selectedOptions[0];
      const newWeekDay = selectedOption.text;

      const weekDaySpan = selectedOption.closest('td').querySelector('.weekday-span');
      weekDaySpan.dataset.weekDay = newWeekDay;
      weekDaySpan.textContent = newWeekDay;
    });
  });


  // Sets up time interval change
  const selectElements = document.querySelectorAll('.select-interval');

  selectElements.forEach(function(selectElement) {
    selectElement.addEventListener('change', function(event) {
      const selectedOption = event.target.selectedOptions[0];
      const timeID = selectedOption.dataset.timeID;
      const textContent = selectedOption.textContent;
      console.log(textContent);

      const timeSpan = selectedOption.closest('td').querySelector('.time-interval-span');
      timeSpan.dataset.timeID = timeID;
      timeSpan.textContent = textContent;
    });
  });


  // FOr changing seat number
  const editButtons = document.querySelectorAll(".change-btn-seatnumber");

  editButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      event.preventDefault();
      const editableSpan = button.closest('td').querySelector('.editable-seat-number-span');


      const inputField = document.createElement("input");
      inputField.type = "number";
      inputField.value = editableSpan.textContent;

      button.parentNode.replaceChild(inputField, editableSpan);
      inputField.focus();
    });
  });

}

$(document).ready(function() {

  const reservationIDInput = document.getElementById('currentReservationID');
  const labNameInput = document.getElementById('currentLabName');
  //Set up change of room
  const selectRoom = document.querySelector('.room-select');
  selectRoom.addEventListener('change', function(event) {
    const selectedOption = event.target.value;
    const roomNameSpan = document.getElementById('room-name-ID');

    roomNameSpan.textContent = selectedOption;
  });
  console.log("edit reservations is working");


//   try {
//     const labName = labNameInput.value;
//     const reservationID = reservationIDInput.value;
//   $.post(`post`,
//     { msg: true,
//       labName: labNameInput,
//       reservationID: reservationIDInput
//       },
//     function(data, status){
//       if(status === 'success'){
//
//
//
//         const templateSource = document.getElementById('edit-template').innerHTML;
//         console.log("Compiling: " + templateSource);
//         const template = Handlebars.compile(templateSource);
//
//         let renderedProfile =  template({
//         data: data.data,
//         reservationID: data.reservationID,
//         userID: data.userID
//       });
//         $('#changeReservation-tbody').empty();
//         $('#changeReservation-tbody').append(renderedProfile);
//         console.log("Rendered compilations for search lab view");
//         console.log(renderedProfile);
//
//
//       }//if
//       else {
//         // Error handling for status other than 'success'
//         console.error("Error:", data);
//         alert("An error occurred while editing the reservation. Please try again."); // Or display appropriate error message
//       }
//     });//fn+post
//
//
// } catch (error) {
// // Handle potential errors during AJAX request or DOM manipulation
// console.error("Error:", error);
// alert("An unexpected error occurred. Please try again later."); // Or display appropriate error message
// }

// Sets up choices for the weekdays

setTimeout(delayedFunction, 1000);
});
