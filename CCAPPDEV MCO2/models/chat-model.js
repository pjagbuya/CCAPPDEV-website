const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');

const roomSchema = new mongoose.Schema({
    roomID : { type: Number,
                required: true },
    roomName : { type: String },
    roomPic : { type: String },
    dlsuID : { type: [Number],
        required: true,
        ref: 'User' },
},{versionKey : false});

const roomModel = mongoose.model('room', roomSchema);

const chatSchema = new mongoose.Schema({
    chatOrder : { type: Number,
                required: true },
    roomID : { type: Number,
                required: true,
                ref: 'Room' },
    dlsuID : { type: Number,
                required: true,
                ref: 'User' },
    userName : { type: String,
                 required: true },
    imageSource : { type: String,
                 required: true },            
    message : { type: String }
},{versionKey : false});

const chatModel = mongoose.model('chat', chatSchema);

function sortChat(chats){
    try{
        chats.sort((a,b) => a.chatOrder - b.chatOrder);
        return chats;
    }catch(error){
        console.error('Error sorting chat:', error);
        throw error;
    }
}
module.exports.RoomModel = RoomModel;
module.exports.ChatModel = ChatModel;