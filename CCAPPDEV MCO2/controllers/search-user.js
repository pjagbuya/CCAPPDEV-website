


const express = require("express");
const searchUserRouter = express.Router();

// model Imports
const userModel = require('../models/register-model');



console.log("Connecteed to router 3")
// Start her after template above


searchUserRouter.get("/:id/search-users",  function(req, resp){ 
    resp.render('html-pages/search/search-user',{
        layout: "user/index-user",
        title: "Search User",
        userType: "user",
        dlsuID: req.params.id
    }); // render & page
});


searchUserRouter.post("/:id/search-user-results",  function(req, resp){
    const searchQuery = { };

    // builds onto the searchQuery object based on filled fields
    // searches all if nothing is filled
    if (req.body.username && req.body.username.trim() !== ''){
        searchQuery.username = req.body.username.trim();
    }
    if (req.body.dlsuID && req.body.dlsuID.trim() !== ''){
        searchQuery.dlsuID = req.body.dlsuID.trim();
    }
    if (req.body.firstname && req.body.firstname.trim() !== ''){
        searchQuery.firstname = req.body.firstname.trim();
    }
    if (req.body.lastname && req.body.lastname.trim() !== ''){
        searchQuery.lastname = req.body.lastname.trim();
    }


    userModel.find(searchQuery).lean().then(function(users){
        resp.render('html-pages/search/search-user-results',{
            layout: "user/index-user",
            title: "User Search Results",
            users: users,
            dlsuID: req.params.id
        }); // render & page
    }); // then & func
});

// for loading the search result
searchUserRouter.get("/profile/:id",  function(req, resp){ 
    const dlsuID = req.params.id;
    const searchQuery = { dlsuID: dlsuID };

    userModel.find(searchQuery).lean().then(function(profile){
        resp.render('html-pages/search/search-user-view',{
            layout: "user/index-user",
            title: "User Search Results",
            profile: profile,
            dlsuID: req.params.id
            
        }); // render & page
    }); // then & func
});




//  Routing to next search result-page insert here, sample given below
// const searchRouter = require('./search-user'); //file name
// userRouter.use("/search-user", searchRouter); //route name



module.exports = searchUserRouter
