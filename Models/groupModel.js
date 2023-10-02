const Mongoose =  require('mongoose');
const Schema = Mongoose.Schema;


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
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the 'User' model
    }],

    date:{
        type : Date,
        default : new Date
    }
})

const Groups = Mongoose.model("Groups",groupSchema);

module.exports = Groups;