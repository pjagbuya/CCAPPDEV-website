const mongoose = require("mongoose")



 const registerSchema = new mongoose.Schema({
   username : String,
   dlsuID  : Number,
   email    : String,
   password : String,
   imageSource: String,
   firstName : String,
   lastName  : String,
   middleInitial: String,
   course: String,
   about: String,
   contact: String,
 }, {versionKey: false});


module.exports = mongoose.model("user", registerSchema);
