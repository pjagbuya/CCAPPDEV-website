//Routes

function add(server){
  server.get('/', function(req, resp){
    resp.render('main',{
      layout: 'index',
      title: 'Chat'
    });
  });
  
  server.post('/chat-send', function(req, resp){
    resp.send({
      message: req.body.msg,
      terminal: 0
    });
  });
}
  module.exports.add = add;
  