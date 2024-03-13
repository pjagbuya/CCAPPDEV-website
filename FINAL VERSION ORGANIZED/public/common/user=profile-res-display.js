
document.addEventListener("DOMContentLoaded", function () {

    const currentDate = new Date();

    const daysContainer = $("#daysContainer");

    for (let i = 0; i < 8; i++) {
      const day = new Date();
      var reservation = ""



      // Hard-coded reservation for the second day
      if (i === 1) {
         reservation = "<div class='date-details'><p class='text-decoration-underline'> GK304B  </p><p>(Seat 32)</p>  <p>7:30 A.M - 8:00 A.M</p> </div>" +

         "<div class='date-details'><p class='text-decoration-underline'> GK304B  </p><p>(Seat 32)</p>  <p>8:00 A.M - 8:30 A.M</p></div>";

       }
       else if (i === 4) {
          reservation = "<div class='date-details'><p class='text-decoration-underline'> GK302A  </p><p>(Seat 16)</p>  <p>10:30 A.M - 11:00 A.M</p> </div>" +

          "<div class='date-details'><p class='text-decoration-underline'> GK302A  </p><p>(Seat 16)</p>  <p>11:00 A.M - 11:30 A.M</p></div>";

        }

        else if (i === 7) {
           reservation = "<div class='date-details'><p class='text-decoration-underline'> GK306B  </p><p>(Seat 20)</p>  <p>2:30 P.M - 3:00 P.M</p></div>";

         }

       day.setDate(currentDate.getDate() + i);

       const options = { weekday: 'short', month: 'short', day: 'numeric' };
       const formattedDate = day.toLocaleDateString('en-US', options);

       const dayDiv = document.createElement("div");
       dayDiv.className = "day";


       const formattedDateElement = document.createElement("div");
       formattedDateElement.className = "format-date";
       formattedDateElement.textContent = formattedDate;

       dayDiv.appendChild(formattedDateElement);
       dayDiv.innerHTML += reservation;

       daysContainer.append(dayDiv);
    }
})
