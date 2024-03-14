

// const updateLabInformation = require("../models/lab-model").updateLabInformation;
const express = require("express");
const Handlebars = require("handlebars");
const searchLabRouter = express.Router();
const updateLabInformation = require("../models/lab-model").updateLabInformation;
// model Imports
const labModel = require('../models/lab-model').LabModel;



console.log("Connecteed to router 3")
// Start her after template above

var labs_array = [];


Handlebars.registerHelper("isAvailable", function(string){
   return string === 'AVAILABLE';
});

searchLabRouter.get("/:id/search-labs",  async function(req, resp){
    await updateLabInformation();
    resp.render('html-pages/search/search-lab',{
        layout: "search/index-search-lab",
        title: "Search Lab",
        imageSource: req.session.user.imageSource,
        userType: "user",
        dlsuID: req.session.user.dlsuID,
        labs: labs_array,

    }); // render & page
});

searchLabRouter.post("/:id/search-labs",  async function(req, resp){

    await updateLabInformation();
    labs_array = [];
    try{
        const filter = {};
        const labs = await labModel.find(filter);

        console.log("labs are loaded");
        console.log("req.body.search has: " + req.body.msg)

        if (req.body.msg){
            labs.forEach(function(lab){
                if(lab.labName.includes(req.body.msg)){
                    const response = {
                        lab: lab

                    }
                    labs_array.push(response);
                }
            });
            console.log("Selecting these particular arrays ");
            console.log(labs_array)
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array)),
                helpers: {
                  isAvailable: function (string) {  return string === 'AVAILABLE';}
                }
            }
            console.log("Response sent to the server:")
            console.log(response);
            resp.send(response);
        }
        else{
          console.log("Triggering seacrh body empty case")
            labs.forEach(function(lab){
                const response = {
                    lab: lab
                }
                labs_array.push(response);
            });
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array)),
                helpers: {
                  isAvailable: function (string) {  return string === 'AVAILABLE';}
                }
            }
            console.log("Response sent to the server:")
            console.log(response);
            resp.send(response);
        }
    }
    catch (error) {
        console.error("Error during getting labs:", error);
        resp.status(500).send({ error: "Internal server error" });
    }
});


//  Routing to next search result-page insert here, sample given below
// const searchRouter = require('./search-Lab'); //file name
// LabRouter.use("/search-Lab", searchRouter); //route name



module.exports = searchLabRouter
