var mongoose = require('mongoose')

const TagFollowSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tagId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('TagFollow', TagFollowSchema);