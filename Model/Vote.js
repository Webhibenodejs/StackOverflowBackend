var mongoose = require('mongoose')

const VoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    ques_ans_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    ques_ans_type: {
        type: String,
        required: true
    },
    like_dislike_type: {
        type: String,
        required: true
    },
    status : {
        type : Boolean,
        default : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Vote', VoteSchema );