var mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
    question_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_type_guest: {
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
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Answer', AnswerSchema );