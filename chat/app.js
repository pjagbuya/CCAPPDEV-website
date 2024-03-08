const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const bodyParser = require('body-parser');
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

app.use(express.static('public'));

const controllers = ['routes'];
for(var i=0; i<controllers.length; i++){
  const model = require('./controllers/'+controllers[i]);
  model.add(app);
}

io.on('connection', (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on("send-message", function(data){
    io.emit("recieve-message", data);
  });
  
  socket.on('disconnect', function(){
    console.log(`user disconnected ${socket.id}`);
  });
});

const port = process.env.PORT | 9090;
server.listen(port, function(){
  console.log('Listening at port '+ port);
});