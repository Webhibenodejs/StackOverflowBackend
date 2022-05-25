var mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true,
        // default : "62874a3c7c343db81a53ec2e"
    },
    userTypeGuest: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        // required: true,
        default : null
    },
    email: {
        type: String,
        // required: true,
        default : null
    },
    answer: {
        type: String,
        required: true
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Answer', AnswerSchema );