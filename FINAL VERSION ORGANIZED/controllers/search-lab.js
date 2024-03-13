


const express = require("express");
const userRouter = express.Router();



// Start her after template above

userRouter.get("",  function(req, resp){

    let user = findID(req.params.id, userData);
    let profName = user['name'];

    resp.render('html-pages/student/profile',{
        layout: 'index-user',
        title: profName,
        name: profName


    });
});



const searchRouter = require('./search-user');
userRouter.use("/search-user", searchRouter);



module.exports = userRouter
