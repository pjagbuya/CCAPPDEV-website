


const express = require("express");
const searchLabRouter = express.Router();

// model Imports
const LabModel = require('../models/lab-model');



console.log("Connecteed to router 3")
// Start her after template above


searchLabRouter.get("/:id/search-labs",  function(req, resp){ 
    resp.render('html-pages/search/search-lab',{
        layout: "search/index-search-lab",
        title: "Search Lab",
        UserType: "user"
    }); // render & page
});




//  Routing to next search result-page insert here, sample given below
// const searchRouter = require('./search-Lab'); //file name
// LabRouter.use("/search-Lab", searchRouter); //route name



module.exports = searchLabRouter
