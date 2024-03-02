//Install Command:
//npm init
//npm i express express-handlebars body-parser

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

server.use(express.static('public'));


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


server.get('/register', function(req, resp){
    resp.render('html-pages/login-reg/register',{
        layout: 'index-home',
        title: 'Register Page'

    });
});



const userRouter = require('./routes/users');
server.use("/user", userRouter);

const port = process.env.PORT | 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
