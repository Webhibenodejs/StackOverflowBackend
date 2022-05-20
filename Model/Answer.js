var mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        required: true
    },
    userTypeGuest: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        default : null
    },
    email: {
        type: String,
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