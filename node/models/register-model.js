const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');



 const registerSchema = new mongoose.Schema({
   username : String,
   dlsuID  : String,
   email    : String,
   password : String,
   imageSource: Buffer,
   firstName : String,
   lastName  : String,
   middleInitial: String,
 }, {versionKey: false});


module.exports = mongoose.model("user", registerSchema);
