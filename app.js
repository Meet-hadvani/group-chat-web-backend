const express = require('express');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const app = express()
const server = http.createServer(app);
const io = socketIO(server);
const SetupSocketConnections = require('./websocket');
const port = process.env.PORT || 3001
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')
const userRouter = require('./Router/userRouter');
const groupRouter = require('./Router/groupRouter');
const friendRouter = require('./Router/friendRouter');
const jwt = require('jsonwebtoken');

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

//Routes
//route For user endpoint
app.use('/user',userRouter);
//route for group endpoint
app.use('/group',groupRouter)
//route for friends
app.use('/friends',friendRouter);


//serve react build
app.use(express.static(path.join(__dirname, 'build')));
// Handle any requests that don't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//establish socket connection
SetupSocketConnections(io,jwt);

server.listen(port,()=>{
   console.log(`App is running on ${port}`)
})