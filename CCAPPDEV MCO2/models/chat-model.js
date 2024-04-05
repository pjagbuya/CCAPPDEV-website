const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');

const roomSchema = new mongoose.Schema({
    roomID : 
        { 
            type: Number,
            required: true 
        },
    roomDetails :
        [{
            dlsuID: 
                { 
                    type: Number,
                    required: true 
                },
            userName: 
                { 
                    type: String,
                    required: true 
                },
            imageSource: 
                { 
                    type: String,
                    required: true 
                }
        }],
    dlsuID : 
        [{
            type: Number,
            ref: 'User',
        }],
},{versionKey : false});

const roomModel = mongoose.model('room', roomSchema);

const chatSchema = new mongoose.Schema({
    chatOrder : 
    { 
        type: Number,
        required: true 
    },
    roomID : 
    { 
        type: Number,
        required: true
    },
    dlsuID : 
    { 
        type: Number,
        required: true
    },
    userName : 
    { 
        type: String,
                 required: true 
    },
    imageSource : 
    { 
        type: String,
        required: true 
    },            
    message : 
    { 
        type: String 
    }
},{versionKey : false});

const chatModel = mongoose.model('chat', chatSchema);

module.exports.roomModel = roomModel;
module.exports.chatModel = chatModel;

const remberSchema = new mongoose.Schema({
    maalaalaMoKaya : Boolean,
    loginPass : String,
    loginID : Number
})
  
const remberModel = mongoose.model('rember', remberSchema);

module.exports.remberModel = remberModel; // rember, no forgor... i forgor how spell rember