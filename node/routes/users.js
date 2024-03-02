


const express = require("express");
const userRouter = express.Router();



const data = require('../dataInfo.js');

console.log("Connecteed to router")
// Start her after template above

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

let userData = data.getData()['student-users'];

userRouter.get("/:id",  function(req, resp){


    let user = findID(req.params.id, userData);
    let profName = user['name'];

    resp.render('html-pages/student/profile',{
        layout: 'index-user',
        title: profName,
        name: profName,
        id: req.params.id


    });
});

userRouter.get("/:id/search-users",  function(req, resp){

  let user = findID(req.params.id, userData);
  let profName = user['name'];
  resp.render('html-pages/search-user/search-user',{
      layout: 'index-user',
      titel: "Search Users",
      name: profName,
      id: req.params.id

  });
});

userRouter.get("/:id/search-labs",  function(req, resp){
  let user = findID(req.params.id, userData);
  let profName = user['name'];
  resp.render('html-pages/search-lab/search-lab',{
      layout: 'search-lab',
      title: "Search Labs",
      name: profName,
      id: req.params.id
  });
});

userRouter.get("/:id/edit-reservation",  function(req, resp){
  let user = findID(req.params.id, userData);
  let profName = user['name'];
  resp.render('html-pages/student-edit/edit-reservation',{
      layout: 'edit-reservation',
      title: "Reservation Edits",
      name: profName,
      id: req.params.id
  });
});
//
// const searchRouter = require('./search-user');
// userRouter.use("/search-user", searchRouter);

module.exports = userRouter
