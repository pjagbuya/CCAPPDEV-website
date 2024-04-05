
const Handlebars = require('handlebars');
const express = require("express");
const bcrypt = require('bcrypt');
const chatRouter = express.Router();

const userModel = require("../models/register-model");
const chatModel = require('../models/chat-model').chatModel;
const roomModel = require('../models/chat-model').roomModel;

const getImageSource = require('./functions/user-info-evaluate-functions.js').getImageSource;

Handlebars.registerHelper('ifEquals', function(id1, id2, options) {
  return (id1 == id2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function(id1, id2, options) {
  return (id1 != id2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('repeat', function(n, block) {
  var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

chatRouter.post('/:user/chat-open', function(req, resp){

  roomModel.find({dlsuID : req.body.dlsuID}).lean().then(function(rooms){

    chatModel.find().lean().then(function(chats){

      resp.send({
        dlsuID : req.body.dlsuID,
        rooms : rooms,
        chats : chats
      });//resp send

    });//chatmodel find

  });//roommodel find

});//chatRouter

chatRouter.post('/:user/chat-send', function(req, resp){

  userModel.find().lean().then(function(users){

    var userName = '';
    for(let i = 0; i < users.length; i++)
    {
      if(users[i].dlsuID === Number(req.body.dlsuID))
      {
        userName = users[i].username;
      }
    }
    
    console.log("index:" + req.body.index);

    chatModel.find({roomID : req.body.roomID}).lean().then(function(chats){

      var chatCount = chats.length;

      var new_chat = new chatModel({
        chatOrder : chatCount,
        roomID : req.body.roomID,
        dlsuID : req.body.dlsuID,
        userName : userName, 
        imageSource : getImageSource(req.body.imageSource),
        message : req.body.message
      });
  
      new_chat.save().then(function(){
  
        resp.send({
          chatOrder : chatCount,
          roomID: req.body.roomID,
          dlsuID : req.body.dlsuID,
          userName : userName, 
          imageSource : getImageSource(req.body.imageSource),
          message: req.body.message,
          index: req.body.index,
          terminal: 0
        });//resp send
  
      });//chatmodel save
  
    });//chatmodel find

  });//usermodel find

});//chat send

chatRouter.post('/:user/chat-connect', function(req, resp){

  chatModel.find({roomID : req.body.roomID}).lean().then(function(chats){

    resp.send({
        chatOrder : chats.length,
        roomID: req.body.roomID,
        dlsuID : req.body.dlsuID,
        roomName: req.body.roomName,
        imageSource: getImageSource(req.body.imageSource),
        chats : chats,
        index : req.body.index,
        terminal: 0
    });//resp send

  });//chatmodel find

});//chat connect

chatRouter.post('/:user/chat-leave', function(req, resp){

  resp.send({
    roomID: req.body.roomID,
    terminal: 0
  });//resp send

});//chat leave

module.exports = chatRouter
