var mongoose = require('mongoose')
const Tag = new mongoose.Schema({
    tagId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true
    }
});




const QuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tag: {
        type: [Tag],
        required: true
    },
    description: {
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

module.exports = mongoose.model('Question', QuestionSchema );