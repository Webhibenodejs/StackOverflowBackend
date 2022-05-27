const User = require("../Model/User");
var mongoose = require('mongoose');
// const { use } = require("express/lib/router");



const viewall_user = (req, res) => {
    return User.aggregate([
        {
            $project: {
                __v: 0,
                password: 0
            },
        },
        {
            $sort: {
                _id: -1
            }
        }
    ])
        .then((data) => {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        })
        .catch((error) => {
            return res.status(200).json({
                status: false,
                data: null,
                error: "Something Went Wrong !!!",
            });
        });
}

const single_use_fetch = (req, res) => {
    return User.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(req.params.id), "isDeleted": false },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followingUserId",
                as: "totalFollower"
            }
        },
        {
            $addFields: { totalFollowerCount: { $size: "$totalFollower" } }
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followerUserId",
                as: "totalFollowing"
            }
        },
        {
            $addFields: { totalFollowingCount: { $size: "$totalFollowing" } }
        },
        {
            $lookup: {
                from: "answers",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: { userTypeGuest: false, isDeleted: false }
                    }
                ],
                as: "totalAnswer"
            }
        },
        {
            $addFields: { totalAnswerCount: { $size: "$totalAnswer" } }
        },
        {
            $lookup: {
                from: "questions",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: { status: true, isDeleted: false }
                    }
                ],
                as: "totalQuestions"
            }
        },
        {
            $addFields: { totalQuestionsCount: { $size: "$totalQuestions" } }
        },
        {
            $lookup: {
                from: "votes",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: { ques_ans_type: "question", status: true, isDeleted: false }
                    }
                ],
                as: "totalQuestionsVotes"
            }
        },
        {
            $addFields: { totalQuestionsVotesCount: { $size: "$totalQuestionsVotes" } }
        },
        {
            $lookup: {
                from: "votes",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: { ques_ans_type: "answer", status: true, isDeleted: false }
                    }
                ],
                as: "totalAnswersVotes"
            }
        },
        {
            $addFields: { totalAnswersVotesCount: { $size: "$totalAnswersVotes" } }
        },
        {
            $lookup: {
                from: "tagfollows",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $lookup: {
                            from: "tags",
                            localField: "tagId",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $match: { status: true, isDeleted: false }
                                },
                                {
                                    $project: {
                                        status: 0,
                                        isDeleted: 0,
                                        createOn: 0,
                                        __v: 0
                                    }
                                }
                            ],
                            as: "TagDeatils"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            userId: 0,
                            tagId: 0,
                            createOn: 0,
                            __v: 0
                        }
                    },
                    { $unwind: "$TagDeatils" },
                ],
                as: "allFollowedTags"
            }
        },
        {
            $lookup: {
                from: "questions",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: { status: true, isDeleted: false }
                    },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        __v: 0,
                                        isDeleted: 0,
                                        status: 0,
                                        createOn: 0
                                    },
                                }
                            ],
                            as: "categoryDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "tags",
                            localField: "tag.tagId",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        __v: 0,
                                        isDeleted: 0,
                                        status: 0,
                                        createOn: 0
                                    },
                                }
                            ],
                            as: "tagDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "answers",
                            localField: "_id",
                            foreignField: "questionId",
                            pipeline: [
                                { $match: { "isDeleted": false } },
                                {
                                    $project: {
                                        __v: 0,
                                        isDeleted: 0,
                                        questionId: 0
                                    },
                                }
                            ],
                            as: "answers"
                        }
                    },
                    {
                        $addFields: { answerCount: { $size: "$answers" } }
                    },
                    {
                        $lookup: {
                            from: "votes",
                            localField: "_id",
                            foreignField: "ques_ans_id",
                            pipeline: [
                                { $match: { "ques_ans_type": "question", isDeleted: false, status: true, like_dislike_type: "like" } },
                            ],
                            as: "likes"
                        }
                    },
                    {
                        $addFields: { likeCount: { $size: "$likes" } }
                    },
                    {
                        $lookup: {
                            from: "votes",
                            localField: "_id",
                            foreignField: "ques_ans_id",
                            pipeline: [
                                { $match: { "ques_ans_type": "question", isDeleted: false, status: true, like_dislike_type: "dislike" } },
                            ],
                            as: "dislikes"
                        }
                    },
                    {
                        $addFields: { dislikeCount: { $size: "$dislikes" } }
                    },
                    {
                        $addFields: { totalVoteCount: { $add: ["$likeCount", "$dislikeCount"] } }
                    },
                    {
                        $project: {
                            status: 0,
                            isDeleted: 0,
                            __v: 0,
                            category: 0,
                            userId: 0,
                            tag: 0,
                            answers:0,
                            likes:0,
                            dislikes:0
                        }
                    },
                    { $unwind: "$categoryDetails" }
                ],
                as: "myQuestions"
            }
        },
        {
            $project: {
                __v: 0,
                password: 0,
                totalFollower: 0,
                totalFollowing: 0,
                totalAnswer: 0,
                totalQuestions: 0,
                totalQuestionsVotes: 0,
                totalAnswersVotes: 0
            },
        }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "User Not Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data[0],
                error: null
            });
        }


    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!"
        });
    });
}

const update_data = (req, res) => {
    return User.findOneAndUpdate(
        { "_id": mongoose.Types.ObjectId(req.params.id) },
        { $set: req.body }
    ).then((result) => {
        return res.send({
            status: true,
            data: { ...result._doc, ...req.body },
            error: null
        })
    }).catch((err) => {
        return res.send({
            status: false,
            data: null,
            error: "Update Failed !!!!"
        })
    });
}

const update_password = (req, res) => {
    return User.findOne({ _id: mongoose.Types.ObjectId(req.params.id), status: true, isDeleted: false, password: req.body.oldPassword }, async (error, user_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (user_exists == null) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Old Password is Wrong !!!'
            });
        }
        else {
            return User.findOneAndUpdate(
                { "_id": mongoose.Types.ObjectId(req.params.id) },
                { $set: { password: req.body.newPassword } }
            ).then((result) => {
                return res.send({
                    status: true,
                    // data: { ...result._doc, ...req.body },
                    data: "Password Changed Succesfully",
                    error: null
                })
            }).catch((err) => {
                return res.send({
                    status: false,
                    data: null,
                    error: "Update Failed !!!!"
                })
            });
        }


    });



}



module.exports = {
    viewall_user,
    single_use_fetch,
    update_data,
    update_password
}