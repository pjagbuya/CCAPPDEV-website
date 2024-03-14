


const express = require("express");
const searchLabRouter = express.Router();

// model Imports
const LabModel = require('../models/lab-model');



console.log("Connecteed to router 3")
// Start her after template above

const labs_array = [];

searchLabRouter.get("/:id/search-labs",  function(req, resp){ 
    resp.render('html-pages/search/search-lab',{
        layout: "search/index-search-lab",
        title: "Search Lab",
        UserType: "user",
        labs: labs_array
    }); // render & page
});

searchLabRouter.post("ajax-searchlab",  async function(req, resp){

    labs_array = [];

    try{
        const filter = {};
        const labs = await LabModel.find(filter);

        if (req.body.search){
            labs.foreach(function(lab){
                if(lab.labName.includes(req.body.search)){
                    const response = {
                        lab: lab
                    } 
                    resp.send(response);
                    labs_array.push(response);
                }
            });
        }
        else{
            labs.foreach(function(lab){
                const response = {
                    lab: lab
                } 
                resp.send(response);
                labs_array.push(response);
            });
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
