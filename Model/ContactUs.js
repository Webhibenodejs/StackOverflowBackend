var mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Contact', ContactSchema);