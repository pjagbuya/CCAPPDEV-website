const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();




ltRouter.get('/:id', function(req, resp){


    resp.render('html-pages/LT/LT-profile',{
        layout: 'index-lt-user',
        title: 'Tech ' + req.session.user.username,
        name: req.session.user.username,
        fullName: req.session.user.firstName +' ' +
                  req.session.user.middleName + ' ' +
                  req.session.user.lastName,
        dlsuID: req.session.user.dlsuID,
        email: req.session.user.email,
        redirectReserve: "/lt-user/" + req.session.user.dlsuID + "/reserve",
        redirectEdit: "/lt-user/" + req.session.user.dlsuID + "/reserve"

    });
});


ltRouter.get('/:id/reserve', function(req, resp){
  resp.render('html-pages/LT/LT-make-reserve',{
      layout: 'index-lt-user-2',
      title: 'Tech Reserve ',
      name: req.session.user.username
  });
})

module.exports = ltRouter
