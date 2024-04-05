const mongoose = require("mongoose")


 const reportSchema = new mongoose.Schema({
   type : String,
   description : String,
   submitterID : String

 }, {versionKey: false});


module.exports = mongoose.model("report-form", reportSchema);
