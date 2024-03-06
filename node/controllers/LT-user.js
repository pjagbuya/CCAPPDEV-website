const express = require("express");
const bcrypt = require('bcrypt');
const ltRouter = express.Router();
const withMongo = require('../app.js').withMongo;
const collectionLogin = "User"



ltRouter.get('/:id', function(req, resp){


    resp.render('html-pages/LT/LT-profile',{
        layout: 'index-lt-user',
        title: 'Tech ' + req.session.user.username

    });
});

module.exports = ltRouter
