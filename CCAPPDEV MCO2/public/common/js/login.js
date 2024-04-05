$(document).ready(function(){

    $.post('load-login', 
    {
    },
    function(data, status)
    {
        if(status === 'success')
        {
            if(data.rememberMe){
                $('#email').val(data.loginDetails);
                $('#pwd').val(data.loginPassword);
            }
        }//if
    }//fn
    );//post
 
});