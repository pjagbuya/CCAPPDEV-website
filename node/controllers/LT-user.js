const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();

const usersModel = require("../models/register-model");




ltRouter.get('/:id', function(req, resp){


    resp.render('html-pages/LT/LT-profile',{
        layout: 'index-lt-user',
        title: 'Tech ' + req.session.user.username,
        name: req.session.user.username,
        fullName: req.session.user.firstName +' ' +
                  req.session.user.middleInitial + ' ' +
                  req.session.user.lastName,
        dlsuID: req.session.user.dlsuID,
        email: req.session.user.email,
        redirectReserve: "/lt-user/" + req.session.user.dlsuID + "/reserve",
        redirectEdit: "/lt-user/" + req.session.user.dlsuID + "/reserve"

    });
});




const reserveRouter = require('./LT-reserve');
ltRouter.use("/:id/", reserveRouter);

module.exports = ltRouter;
