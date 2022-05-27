const Follow = require("../Model/Follow");
const TagFollow = require("../Model/TagFollow");
var mongoose = require('mongoose');


const create = (req, res) => {
    let dataSet = {
        followingUserId: mongoose.Types.ObjectId(req.body.followingUserId),
        followerUserId: mongoose.Types.ObjectId(req.body.followerUserId),
        createOn: new Date()
    }
    return Follow.findOne({
        followingUserId: mongoose.Types.ObjectId(req.body.followingUserId),
        followerUserId: mongoose.Types.ObjectId(req.body.followerUserId),
    }, async (error, follow_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (follow_exists != null) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Already Following !!!'
            });
        } else {
            const dataModel = new Follow(dataSet);
            dataModel.save()
                .then((result) => {
                    return res.send({
                        status: true,
                        // data: result,
                        data: "Successfully Followed !!!",
                        error: null
                    })
                }).catch((err) => {
                    return res.send({
                        status: false,
                        data: null,
                        error: err
                    })
                });
        }
    });
}

const checkFollowing = (req, res) => {
    return Follow.findOne({
        followingUserId: mongoose.Types.ObjectId(req.body.followingUserId),
        sessionUserId: mongoose.Types.ObjectId(req.body.sessionUserId),
    }, async (error, follow_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (follow_exists != null) {
            res.status(200).json({
                status: true,
                data: 'Already Following !!!',
                error: null
            });
        } else {
            res.status(200).json({
                status: false,
                data: 'Not Yet Follwed !!!!',
                error: null
            });
        }
    });
}

const unfollow = (req, res) => {
    return Follow.remove({
        followingUserId: mongoose.Types.ObjectId(req.body.followingUserId), sessionUserId: mongoose.Types.ObjectId(req.body.sessionUserId)
    }).then((data) => {
        if (data.deletedCount == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "Already Unfollowed !!! ",
            });
        } else {
            return res.status(200).json({
                status: true,
                data: "Succesfully Unfollowed !!!",
                error: null
            });
        }
    }).catch((error) => {
        res.status(500).json({
            status: false,
            data: null,
            error: "Delete Failed !!!"
        });
    });
}

const tagFollowCreate = (req, res) => {
    let dataSet = {
        userId: mongoose.Types.ObjectId(req.body.userId),
        tagId: mongoose.Types.ObjectId(req.body.tagId),
        createOn: new Date()
    }

    return TagFollow.findOne({
        userId: mongoose.Types.ObjectId(req.body.userId),
        tagId: mongoose.Types.ObjectId(req.body.tagId),
    }, async (error, follow_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (follow_exists != null) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Already Following !!!'
            });
        } else {
            const dataModel = new TagFollow(dataSet);
            dataModel.save()
                .then((result) => {
                    return res.send({
                        status: true,
                        data: "Successfully Followed !!!",
                        error: null
                    })
                }).catch((err) => {
                    return res.send({
                        status: false,
                        data: null,
                        error: err
                    })
                });
        }
    });
}

const checkTagFollowing = (req, res) => {
    return TagFollow.findOne({
        userId: mongoose.Types.ObjectId(req.body.userId),
        tagId: mongoose.Types.ObjectId(req.body.tagId),
    }, async (error, follow_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (follow_exists != null) {
            res.status(200).json({
                status: true,
                data: 'Already Following !!!',
                error: null
            });
        } else {
            res.status(200).json({
                status: false,
                data: 'Not Yet Follwed !!!!',
                error: null
            });
        }
    });
}

const unfollowTag = (req, res) => {
    return TagFollow.remove({
        userId: mongoose.Types.ObjectId(req.body.userId), tagId: mongoose.Types.ObjectId(req.body.tagId)
    }).then((data) => {
        if (data.deletedCount == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "Already Unfollowed !!! ",
            });
        } else {
            return res.status(200).json({
                status: true,
                data: "Succesfully Unfollowed !!!",
                error: null
            });
        }
    }).catch((error) => {
        res.status(500).json({
            status: false,
            data: null,
            error: "Delete Failed !!!"
        });
    });
}

module.exports = {
    create,
    checkFollowing,
    unfollow,
    tagFollowCreate,
    checkTagFollowing,
    unfollowTag
}