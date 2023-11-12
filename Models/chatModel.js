const Mongoose =  require('mongoose');
const Schema = Mongoose.Schema;


const chatSchema = new Mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the 'User' model
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
})

const Chats = Mongoose.model("Chats",chatSchema);

module.exports = Chats;