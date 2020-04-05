const   http  = require('http'),
        url   = require('url'),
        fs    = require('fs'),
        io    = require('socket.io');

//WOM verify 
//        path = require('path'),
//        express = require('express');
const formatMessage = require('./exports/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./exports/users');

// MongoDB
/*const mongoose    = require('mongoose');
const Restaurant  = require('./model/Log');
const Order       = require('./model/History');

const connectionString = 'mongodb+srv://wanja:wanja@cluster0-t8c4x.mongodb.net/Restaurants?retryWrites=true&w=majority'

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log('Mongoose connect successfully');
    },
  error => {
      console.log(`Mongoose could not connect to the database: ${error}`);
    }
  );
*/

const server = http.createServer(function(req, res) {
  var path = url.parse(req.url).pathname;
    switch (path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) return send404(res);
        res.writeHead(200, { 
          'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html' 
        });
        res.write(data, 'utf8');
        res.end();
       });
       break;
    case '/chat.html':
      fs.readFile(__dirname + '/chat.html', function (err, data) {
        if (err) return send404(res);
        res.writeHead(200, { 
          'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html' 
        });
        res.write(data, 'utf8');
        res.end();
       });
       break;
    default: send404(res);
  }
}),
  send404 = function (res) {
    res.writeHead(404);
  //  res.write('404');
    res.write('Page was not found');
    res.end();
  };

const port = 3000;
 server.listen(port, function() {
    console.log(`Server running at port ${port}`); 
});

// Setup socket.io
const ioServer = io.listen(server);

// New connection 
 ioServer.on('connection', socket => {
  console.log('Connected...');
  //console.log(`Socket: ${socket.id}`);

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Current user
    socket.emit('message', formatMessage(username, 'Welcome to Chat'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(user.username, ' joined the chat')
      );

    // Send users and room info
    ioServer.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    ioServer.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      ioServer.to(user.room).emit(
        'message',
        formatMessage(user.username, 'has left the chat')
      );

      // Send users and room info
      ioServer.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});