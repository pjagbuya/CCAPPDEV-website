
//Github Repository link: https://github.com/pjagbuya/CCAPPDEV-website
//boilerplate begins here
//Global db
const Reservation = require("./models/reserve-model");
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

module.exports.mongoose= require('mongoose');
module.exports.mongoose.connect('mongodb://localhost:27017/AnimoDB');

const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

app.use(express.static('public'));
//ends here
const session = require('express-session');

app.use(session({
  secret: 'hjalksjfla',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

function successFn(res){
    console.log('Database query successful!');
}

// MongoDB setup
// PRIMARY KEYS ARE AUTOMATIC
const {MongoClient} = require('mongodb');
const databaseURL = "mongodb://localhost:27017";
const mongoClient = new MongoClient(databaseURL);

const databaseName = "AnimoDB";
const collectionLogin = "User";

//Helpersconst handlebars = require('handlebars');



mongoClient.connect().then(function(con){

  console.log("Attempt to create!");
  const dbo = mongoClient.db(databaseName);
  db = dbo;

  dbo.createCollection(collectionLogin)
    .then(successFn)
    .catch(function (err){
      console.log('Collection already exists');
  });
}).catch(errorFn);

app.get('/', function(req, resp){
    resp.render('html-pages/home/H-home',{
        layout: 'home/index-home',
        title: 'Welcome to AnimoLab'

    });
});

const registerLoginRouter = require('./controllers/register')
app.use("/", registerLoginRouter);

const userRouter = require('./controllers/users');
app.use("/user", userRouter);

const loginRouter = require('./controllers/login');
app.use("/", loginRouter);

const chatRouter = require('./controllers/chat');
app.use("/", chatRouter);

const reportFormRouter = require('./controllers/report-form');
app.use("/user", reportFormRouter);

//const searchUserRouter = require('./controllers/search-user');
//app.use("/search-user", searchUserRouter);

// const searchLabRouter = require('./controllers/search-lab');
// app.use("/", searchLabRouter);
let currReservations= []
io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.emit("reserveUpdate", currReservations);
    socket.on('reserved', (dlsuID)=>{
      currReservations = Reservation.find({userID:dlsuID});
      socket.emit("reserveUpdate", currReservations);
      socket.broadcast.emit("reserveUpdate", currReservations);
    })
    socket.on("send-message", function(data){
      if(data.roomID === ""){
        io.emit("recieve-message", data);
      }
      else{
        socket.to(data.roomID).emit("recieve-message", data);
      }
    });

    socket.on("join-room", function(roomID){
      socket.join(roomID);
    });
  
    socket.on("leave-room", function(roomID){
      socket.leave(roomID);
    });

    socket.on('disconnect', function(){
      console.log(`user disconnected ${socket.id}`);
    });
  });

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
