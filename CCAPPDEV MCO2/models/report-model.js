const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');



 const reportSchema = new mongoose.Schema({
   type : String,
   description : String,
   submitterID : String

 }, {versionKey: false});


module.exports = mongoose.model("report-form", reportSchema);