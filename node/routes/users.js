


const express = require("express");
const userRouter = express.Router();




console.log("Connecteed to router")
// Start her after template above

function PutUserData(req, res, next)
{
  if (req.body.userID == 1){

  }
  next()

}

function findID(id, data)
{
  let final = "";
  for(let i = 0; i < data.length; i++){
    if(data[i]['id'] == id){
      return data[i];
    }
  }
  return final;

}
const data = require('../dataInfo.js');

let userData = data.getData()['student-users'];






userRouter.get("/",  function(req, resp){




    resp.render('html-pages/student/profile',{
        layout: 'index-user',
        title: req.user.username,
        name: req.user.username,
        id: req.user.id
    });
});

userRouter.get("/search-users",  function(req, resp){
  let profName = req.user.name;
  resp.render('html-pages/search-user/search-user',{
      layout: 'index-user',
      titel: "Search Users",
      name: req.user.username,
      id: req.user.id

  });
});

userRouter.get("/search-labs",  function(req, resp){
  let profName = req.user.name;
  resp.render('html-pages/search-lab/search-lab',{
      layout: 'search-lab',
      title: "Search Labs",
      name: req.user.username,
      id: req.user.id
  });
});

userRouter.get("/edit-reservation",  function(req, resp){
  let profName = req.user.name;
  resp.render('html-pages/student-edit/edit-reservation',{
      layout: 'edit-reservation',
      title: "Reservation Edits",
      name: req.user.username,
      id: req.user.id
  });
});
//
// const searchRouter = require('./search-user');
// userRouter.use("/search-user", searchRouter);

module.exports = userRouter

module.exports.data = data
