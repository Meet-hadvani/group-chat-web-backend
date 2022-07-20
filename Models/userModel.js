const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isOnline : {
        type : Boolean,
        default : true
    },
    date:{
        type : Date,
        default : new Date
    }
})

const Users = mongoose.model("Users",userSchema);

module.exports = Users;