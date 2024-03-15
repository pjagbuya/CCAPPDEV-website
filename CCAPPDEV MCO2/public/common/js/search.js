
$(document).ready(function () {


    $("#search-lab-msg-txt").on('input',function(e){
      $('.lab-choices-section').empty();

      e.preventDefault();

        $.post('search-labs',
          { msg: $('#search-lab-msg-txt').val() },
          function(data, status){
            if(status === 'success'){
              $('.lab-choices-section').empty();
              console.log(data);
              console.log("Labs in data")
              console.log(data.labs);


              const templateSource = document.getElementById('lab-template').innerHTML;
              console.log("Compiling: " + templateSource);
              const template = Handlebars.compile(templateSource);
              Handlebars.registerHelper("isAvailable", function(string){
                 return string === 'AVAILABLE';
              });
              let renderedProfile =  template({
              labs:data.labs
            });

              $('.lab-choices-section').append(renderedProfile);
              console.log("Rendered compilations for search lab view");
              console.log(renderedProfile);

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
            }//if
          });//fn+post
      });//btn
  });
