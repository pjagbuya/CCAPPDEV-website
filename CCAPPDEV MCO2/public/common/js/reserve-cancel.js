$(document).ready(function(){
    for(let i=0; i<100; i++){
        $("#btn-cancel"+i).click(function(){
            var result = confirm("Cancel this reservation?")
            if(result==true){
                $.post('/user/:id/reservations/view/cancel', {reservationID: $("#btn-cancel"+i).attr("name")},
                    function(data, status){
                        if(status === 'success'){
                            window.alert("Reservation Cancelled for "+ data.reservationID+ "! Refresh page to see changes")
                        }//if
                });//fn+post
            }
        });//click
    }
});