// function updateUserInfo() {
//   fetch(`/user/${dlsuID}`) // Replace with actual URL
//     .then(response => response.json())
//     .then(data => {
//
//       const templateSource = document.getElementById('reservations-list-template').innerHTML;
//       console.log("Compiling: " + templateSource);
//       const template = Handlebars.compile(templateSource);
//
//       let renderedProfile =  template({
//       seats:data.seats
//     })
//
//     $('#daysContainer').innerHTML = renderedProfile;
//     .catch(error => {
//       console.error('Error fetching user info:', error);
//
//     });
// }
//
// // function updateReservations() {
// //   fetch(`/user/${req.session.user.dlsuID}/reservations`) // Replace with actual URL
// //     .then(response => response.json())
// //     .then(data => {
// //       // Update UI elements with new reservations data (e.g., re-render reservation list)
// //     })
// //     .catch(error => {
// //       console.error('Error fetching reservations:', error);
// //       // Handle errors gracefully (e.g., display an error message)
// //     });
// // }
//
// // Call update functions periodically (e.g., using setInterval)
// setInterval(updateUserInfo, 500); // Update every 5 seconds (adjust interval as needed)
// // setInterval(updateReservations, 10000); // Update every 10 seconds (adjust interval as needed)

const socket = io('http://localhost:3000');
socket.on("connect", ()=>{
  console.log("Socket connected client side in user-update-reservation");
})
socket.on("reserveUpdate", (data)=>{

    const templateSource = document.getElementById('reservations-list-template').innerHTML;
    console.log("Compiling: " + templateSource);
    const template = Handlebars.compile(templateSource);

    let renderedProfile =  template({
    seats:data.seats
  })

  $('#daysContainer').innerHTML = renderedProfile;
})
