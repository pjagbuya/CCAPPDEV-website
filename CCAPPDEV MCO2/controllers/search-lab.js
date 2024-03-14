


const express = require("express");
const searchLabRouter = express.Router();

// model Imports
const labModel = require('../models/lab-model').LabModel;



console.log("Connecteed to router 3")
// Start her after template above

var labs_array = [];

searchLabRouter.get("/:id/search-labs",  function(req, resp){ 
    resp.render('html-pages/search/search-lab',{
        layout: "search/index-search-lab",
        title: "Search Lab",
        UserType: "user",
        labs: labs_array
    }); // render & page
});

searchLabRouter.post("/:id/search-labs",  async function(req, resp){

    
    
    labs_array = [];
    try{
        const filter = {};
        const labs = await labModel.find(filter);

        console.log(labs);

        if (req.body.search){
            labs.forEach(function(lab){
                if(lab.labName.includes(req.body.search)){
                    const response = {
                        lab: lab
                    } 
                    labs_array.push(response);
                }
            });
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array))
            } 
            resp.send(response);
        }
        else{
            labs.forEach(function(lab){
                const response = {
                    lab: lab
                } 
                labs_array.push(response);
            });
            const response = {
                labs: JSON.parse(JSON.stringify(labs_array))
            } 
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
