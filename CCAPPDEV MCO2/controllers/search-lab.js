

// const updateLabInformation = require("../models/lab-model").updateLabInformation;
const express = require("express");
const Handlebars = require("handlebars");
const searchLabRouter = express.Router();
const updateLabInformation = require("../models/lab-model").updateLabInformation;
// model Imports
const labModel = require('../models/lab-model').LabModel;
const isUserTechnician = require('./functions/user-info-evaluate-functions.js').isUserTechnician;
const getUserType = require('./functions/user-info-evaluate-functions.js').getUserType;



console.log("Connecteed to router 3")
// Start her after template above

var labs_array = [];


Handlebars.registerHelper("isAvailable", function(string){
   return string === 'AVAILABLE';
});

searchLabRouter.get("/:id/search-labs",  async function(req, resp){
    await updateLabInformation();
    const filter = {};
    labs_array = await labModel.find(filter);
    var imageSource;

    if(req.session.user.imageSource){
      imageSource = req.session.user.imageSource
    }else{
      imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
    }
    
    console.log("Session Data: " + JSON.stringify(req.session));
    resp.render('html-pages/search/search-lab',{
        layout: "search/index-search-lab",
        title: "Search Lab",
        imageSource: imageSource,
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
        const stringID = req.params.id+""
        const userType = getUserType(stringID);

        console.log("User type for search labs: ", userType);
        console.log("String ID for search labs: ", stringID);
        console.log(`/${userType}/${req.params.id}/reserve/${req.params.id}`);


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
                userType:userType,
                dlsuID: req.params.id,
                redirectBaseURL: `/${userType}/${req.params.id}/reserve/${req.params.id}`,
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
            // const labs = await labModel.find({});
            labs.forEach(function(lab){

                const response = {
                    lab: lab
                }
                labs_array.push(response);
            });
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array)),
                userType:userType,
                dlsuID: req.params.id,
                redirectBaseURL:`/${userType}/${req.params.id}/reserve/${req.params.id}`,
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

searchLabRouter.post("/search-labs",  async function(req, resp){

    await updateLabInformation();
    labs_array = [];
    try{
        const filter = {};
        const labs = await labModel.find(filter);
        const stringID = req.params.id+""
        const userType = getUserType(stringID);

        console.log("User type for search labs: ", userType);
        console.log("String ID for search labs: ", stringID);
        console.log(`/${userType}/${req.params.id}/reserve/${req.params.id}`);


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
                userType:userType,
                dlsuID: req.params.id,
                redirectBaseURL: `/${userType}/${req.params.id}/reserve/${req.params.id}`,
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
            // const labs = await labModel.find({});
            labs.forEach(function(lab){

                const response = {
                    lab: lab
                }
                labs_array.push(response);
            });
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array)),
                userType:userType,
                dlsuID: req.params.id,
                redirectBaseURL:`/${userType}/${req.params.id}/reserve/${req.params.id}`,
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


const userReserveRouter = require('./userReserve.js');
searchLabRouter.use("/:id", userReserveRouter );
module.exports = searchLabRouter
