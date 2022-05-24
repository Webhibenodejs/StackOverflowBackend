const Follow = require("../Model/Follow");
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
                        data : "Successfully Followed !!!",
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

module.exports = {
    create
}