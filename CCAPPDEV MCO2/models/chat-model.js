const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/AnimoDB');

const roomSchema = new mongoose.Schema({
    roomID : { type: Number,
                required: true },
    roomName : { type: String }
},{versionKey : false});

const RoomModel = mongoose.model('Room', roomSchema);

const chatSchema = new mongoose.Schema({
    chatOrder : { type: Number,
                required: true },
    roomID : { type: Number,
                required: true,
                ref: 'Room' },
    userID : { type: Number,
                required: true,
                ref: 'User' },
    message : { type: String }
},{versionKey : false});

const ChatModel = mongoose.model('Chat', chatSchema);

const userSchema = new mongoose.Schema({
    userID : { type: Number,
        required: true },
    userName : { type: String }
},{versionKey : false});

const UserModel = mongoose.model('User', userSchema);

module.exports.RoomModel = RoomModel;
module.exports.ChatModel = ChatModel;
module.exports.UserModel = UserModel;