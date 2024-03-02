


const express = require("express");
const searchRouter = express.Router();



console.log("Connecteed to router 3")
// Start her after template above


searchRouter.get("/",  function(req, resp){

    resp.render('html-pages/student/search-user',{
        layout: 'index-user',
        name: profName

    });
});




//  Routing to next search result-page insert here, sample given below
// const searchRouter = require('./search-user'); //file name
// userRouter.use("/search-user", searchRouter); //route name



module.exports = userRouter
