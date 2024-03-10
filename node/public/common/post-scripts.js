
// Function to handle the button click and make a POST request using jQuery
function reserveStudent(dlsuID, labRoom) {

  const techID = $('#techNameLabel').text();
  console.log("Sending from ajax " +dlsuID + " with " + labRoom)
  $.ajax({
    url: `/lt-user/${dlsuID}/reserve`,
    type: 'POST',

    data: {
      roomName: labRoom,
      userID: dlsuID,
    },
    success: function (result, status) {
      console.log(result);
      window.location.href = result.redirect;
    },

  });
}


$(document).ready(function () {

  $('.reserve-student-button').on('click', function (event) {

    const row = $(event.target).closest('tr');
    const dlsuID = row.find('.table-cell:nth-child(1)').text();
    const labRoom = $('#roomName').text();

    console.log("techID");

    reserveStudent(dlsuID, labRoom);
  });

  // Simulate the click event on page load
  $('.reserve-student-button').trigger('click');
});
