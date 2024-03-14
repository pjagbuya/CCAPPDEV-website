
$(document).ready(function () {

    
    $("#search-lab-msg-btn").on('click',function(e){
      e.preventDefault();
        $.post('search-labs',
          { msg: $('#search-lab-msg-txt').val() },
          function(data, status){
            if(status === 'success'){
              console.log(data);
              console.log(data.labs);
              $('#search-lab-msg-txt').val('');

              let profileTemplateString = document.getElementById("lab-template").innerHTML;
              let renderProfile = Handlebars.compile(profileTemplateString);

              const templateSource = document.getElementById('lab-template').innerHTML;
              console.log("Compiling: " + templateSource);
              const template = Handlebars.compile(templateSource);
              Handlebars.registerHelper('isNull', function(user, options) {
                return user === null ? options.fn(this) : options.inverse(this);;
              });
              let renderedProfile =  renderProfile({
              labs:data,
              helpers: {
                eq: function (a, b, options) {
                    return a === b ? options.fn(this) : options.inverse(this);
                  },
                  isNull: function(user, options) {
                                  return user === null ? options.fn(this) : options.inverse(this);
                                }
              }});

              $('.lab-choices-section').append(renderedProfile);
              console.log(renderProfile);
            }//if
          });//fn+post
      });//btn
  });