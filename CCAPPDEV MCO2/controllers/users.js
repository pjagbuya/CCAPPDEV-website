


const express = require("express");
const userRouter = express.Router();



userRouter.get("/:id",  function(req, resp){
  console.log("Attempting to load" + req.params.id);
  if(req.session.user){
    console.log("Logged in as")
    console.log(req.session.user)
    resp.render('html-pages/user/U-user',{
        layout: 'user/index-user',
        title: req.session.user['username'],
        userType: 'user',
        name: req.session.user['username'],
        id: req.session.user['dlsuID'],
        dlsuID: req.session.user['dlsuID']

    });
  }



});

// userRouter.get("/search-users",  function(req, resp){
//   let profName = req.user.name;
//   resp.render('html-pages/search-user/search-user',{
//       layout: 'index-user',
//       titel: "Search Users",
//       name: req.user.username,
//       id: req.user.id
//
//   });
// });
//
// userRouter.get("/search-labs",  function(req, resp){
//   let profName = req.user.name;
//   resp.render('html-pages/search-lab/search-lab',{
//       layout: 'search-lab',
//       title: "Search Labs",
//       name: req.user.username,
//       id: req.user.id
//   });
// });
//
// userRouter.get("/edit-reservation",  function(req, resp){
//   let profName = req.user.name;
//   resp.render('html-pages/student-edit/edit-reservation',{
//       layout: 'edit-reservation',
//       title: "Reservation Edits",
//       name: req.user.username,
//       id: req.user.id
//   });
// });
//
const searchRouter = require('./search-user');
userRouter.use("/", searchRouter);

module.exports = userRouter
