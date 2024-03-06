

//boilerplate begins here
//Global db

const express = require('express');
const server = express();
module.exports.mongoose= require('mongoose');
module.exports.mongoose.connect('mongodb://localhost:27017/AnimoDB');


const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
server.use(express.static('public'));
//ends here
const session = require('express-session');

server.use(session({
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



//
//
let db;




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





module.exports.withMongo = (fn) => async (req, res, next) => {
  try {
    req.db = db;
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};


server.get('/', function(req, resp){
    resp.render('html-pages/welcome',{
        layout: 'index-home',
        title: 'Welcome to AnimoLab'

    });
});

const registerLoginRouter = require('./controllers/register-login')
server.use("/", registerLoginRouter);

const userRouter = require('./controllers/users');
server.use("/user", userRouter);

const loginRouter = require('./controllers/login');
server.use("/", loginRouter);





const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
