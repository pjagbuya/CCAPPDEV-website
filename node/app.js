//Install Command:
//npm init
//npm i express express-handlebars body-parser
if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


const data = require('./dataInfo.js');

let userData = data.getData()['student-users'];


//This example is an example for the use of Ajax with JQuery.
const express = require('express');
const server = express();
const router = express.Router();


const bodyParser = require('body-parser')
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
const bcrypt = require('bcrypt');
const passport = require("passport");
const flash = require('express-flash');
const session = require('express-session');
const initializePassport = require('./passport-config')
sample_users = []

initializePassport(passport,
                   emailID => sample_users.find(user=> user.email===emailID ),
                   userID => sample_users.find(user=> user.id===userID ),
                    )


server.use(express.static('public'));
server.use(flash())
server.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

server.use(passport.initialize());
server.use(passport.session());





server.get('/', function(req, resp){
    resp.render('html-pages/welcome',{
        layout: 'index-home',
        title: 'Welcome to AnimoLab'

    });
});
server.get('/login', function(req, resp){
    resp.render('html-pages/login-reg/login',{
        layout: 'index-home',
        title: 'Login Page'

    });
});

server.post('/login', passport.authenticate('local', {
  successRedirect: '/user',
  failurRedirect: '/login',
  failureFlash: true
}));


server.get('/register', function(req, resp){
    resp.render('html-pages/login-reg/register',{
        layout: 'index-home',
        title: 'Register Page'

    });
});


server.post('/register', async (req, resp) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    sample_users.push({
      username : req.body.username,
      id : req.body.id,
      email: req.body.email,
      password : hashedPassword
    })


    resp.redirect('/login')

  } catch (e) {
    resp.redirect("/register")

  }
  console.log("Received post request");
  console.log(sample_users);


});


const userRouter = require('./routes/users');
server.use("/user", userRouter);

const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
