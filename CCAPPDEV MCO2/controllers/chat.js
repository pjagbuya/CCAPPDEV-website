
const Handlebars = require('handlebars');
const express = require("express");
const bcrypt = require('bcrypt');
const chatRouter = express.Router();

const chatModel = require('../models/chat-model');

Handlebars.registerHelper('ifEquals', function(id1, id2, options) {
  return (id1 == id2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function(id1, id2, options) {
  return (id1 != id2) ? options.fn(this) : options.inverse(this);
});

chatRouter.post('/chat-send', function(req, resp){
    
  var imageSource;

  if(req.session.user.imageSource){
    imageSource = req.session.user.imageSource
  }else{
    imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
  }

  var searchQuery = {roomID : req.body.roomID};

  chatModel.find(searchQuery).then(function(chats){

    var chatCount = chats.size();

    var new_chat = new chatModel({
      chatOrder : chatCount,
      roomID : req.body.roomID,
      dlsuID : req.session.user.dlsuID,
      userName : req.session.user.username, 
      imageSource : imageSource,
      message : req.body.message
    });

    new_chat.save(function(err,result){
      if (err){
          console.log(err);
      }
      else{
          console.log(result)
      }
    });

    resp.send({
        chatOrder : chatCount,
        roomID: req.body.roomID,
        dlsuID: req.session.user.dlsuID,
        username: req.session.user.username,
        imageSource: imageSource,
        message: req.body.message,
        terminal: 0
    });
  });
});

chatRouter.post('/chat-connect', function(req, resp){

  var imageSource;

  if(req.session.user.imageSource){
    imageSource = req.session.user.imageSource
  }else{
    imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
  }

  var searchQuery = {roomID : req.body.roomID};

  chatModel.find(searchQuery).then(function(chats){

    resp.send({
        chatOrder : chatCount,
        roomID: req.body.roomID,
        dlsuID: req.session.user.dlsuID,
        username: req.session.user.username,
        imageSource: imageSource,
        chats : chats,
        terminal: 0
    });
  });
});
module.exports = chatRouter
