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


    $("#search-user-txt").on('input',function(e){


      e.preventDefault();

        $.post('search-users',
          { msg: $('#search-user-txt').val() },
          function(data, status){
            if(status === 'success'){
              $('#user-results-tbody').empty();
              console.log(data);
              console.log("Users in data")
              console.log(data.users);


              const templateSource = document.getElementById('user-results-template').innerHTML;
              console.log("Compiling: " + templateSource);
              const template = Handlebars.compile(templateSource);
              Handlebars.registerHelper("isAvailable", function(string){
                 return string === 'AVAILABLE';
              });
              let renderedProfile =  template({
              users:data.users,
              techID: data.techID
            });

              $('#user-results-tbody').append(renderedProfile);
              console.log("Rendered compilations for search lab view");
              console.log(renderedProfile);
              $('.reserve-student-button').on('click', function (event) {

                const row = $(event.target).closest('tr');
                const dlsuID = row.find('.table-cell:nth-child(1)').text();
                const labRoom = $('#roomName').text();

                console.log("techID");

                reserveStudent(dlsuID, labRoom);
              });


            }//if
          });//fn+post
      });//btn
  });
