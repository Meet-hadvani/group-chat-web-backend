const express = require('express');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const app = express()
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3001
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')
const userRouter = require('./Router/userRouter');
const groupRouter = require('./Router/groupRouter');
const friendRouter = require('./Router/friendRouter');

//middlewares
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Update with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));

  
// app.use(cors());


//connect to db
//Connect to the database. the username and password is safe in .env file
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser : true,
    useUnifiedTopology : true
})

//To check if databse connected
const db = mongoose.connection;
db.once('open', () => console.log('connected to db'))


//serve react build
app.use(express.static(path.join(__dirname, 'build')));
// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


/*
// Socket.IO event handling
io.use((socket, next) => {
  // Get the JWT token from the handshake headers
  const token = socket.handshake.headers['authorization'];

  if (!token) {
    // If no token is present, disconnect the user
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to the socket object for later use
    socket.user = decoded.user;
    next();
  } catch (error) {
    // If token verification fails, disconnect the user
    return next(new Error('Authentication error: Invalid token'));
  }
});


// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected', socket.user);
  
    // Handle custom events
    socket.on('chat message', (message) => {
      console.log('Message from client:', message);
  
      // Broadcast the message to all connected clients
      io.emit('chat message', message);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
*/


//Routes
//route For user endpoint
app.use('/user',userRouter);
//route for group endpoint
app.use('/group',groupRouter)
//route for friends
app.use('/friends',friendRouter);


server.listen(port,()=>{
   console.log(`App is running on ${port}`)
})