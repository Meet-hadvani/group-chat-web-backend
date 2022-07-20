const express = require('express');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3001
const mongoose = require('mongoose');
const cors = require('cors')
const userRouter = require('./Router/userRouter');

//middlewares
app.use(express.json());
app.use(cors());


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


app.listen(port,()=>{
   console.log(`App is running on ${port}`)
})