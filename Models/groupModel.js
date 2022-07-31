const Mongoose =  require('mongoose');
// const userSchema = require('./userModel')

const userSchema = new Mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    isOnline : {
        type : Boolean,
        default : false
    },
    isAdmin : {
        type: Boolean
    },
    joiningDate:{
        type : Date,
        default : new Date
    }
},{ _id : false })

const groupSchema = new Mongoose.Schema({
    name : {
        type : String,
        required:true
    },

    createdBy : {
        type : String,
        required : true
    },

    members: [{
        type : userSchema
    }],

    date:{
        type : Date,
        default : new Date
    }
})

const Groups = Mongoose.model("Groups",groupSchema);

module.exports = Groups;