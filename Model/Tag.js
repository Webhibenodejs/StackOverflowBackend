var mongoose = require('mongoose')

const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Tag', TagSchema);