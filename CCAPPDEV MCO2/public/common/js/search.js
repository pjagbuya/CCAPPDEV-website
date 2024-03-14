$(document).ready(function () {

    $("#search-lab-msg-btn").click(function(){
        $.post('ajax-searchlab',
          { msg: $('#search-lab-msg-txt').val() },
          function(data, status){
            if(status === 'success'){
              $('#search-lab-msg-txt').val('');
            }//if
          });//fn+post
      });//btn
  });