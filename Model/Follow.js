var mongoose = require('mongoose')

const FollowSchema = new mongoose.Schema({
    followingUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },    // eke follow korche
    followerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },  // e follow korche
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Follow', FollowSchema);