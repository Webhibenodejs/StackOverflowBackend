var mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type : String,
        default : "https://templates.envytheme.com/pify/default/assets/images/user/user-15.jpg"
    },
    bio : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default : true
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema );