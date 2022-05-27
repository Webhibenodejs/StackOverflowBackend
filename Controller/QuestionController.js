const Question = require("../Model/Question");
var mongoose = require('mongoose');




const create = (req, res) => {
    let dataSet = {
        title: req.body.title,
        userId: req.body.userId,
        category: req.body.category,
        tag: req.body.tag,
        description: req.body.description,
        createOn: new Date()
    }
    const dataModel = new Question(dataSet);
    dataModel.save()
        .then((result) => {
            return res.send({
                status: true,
                data: result,
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

const viewall = (req, res) => {
    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true }
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
                            // _id: 0,
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            status: 0,
                            isDeleted: 0,
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
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                tag: 0,
                category: 0,
                userId: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            }
        },
        { $unwind: "$userDetails" },
        { $unwind: "$categoryDetails" },
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });
}

const update_data = (req, res) => {
    return Question.findOneAndUpdate(
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

const delete_data = (req, res) => {
    // return Question.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
    //     .then((data) => {
    //         return res.status(200).json({
    //             success: true,
    //             data: data,
    //             error : null
    //         });
    //     })
    //     .catch((error) => {
    //         res.status(500).json({
    //             success: false,
    //             data: null,
    //             error: "Delete Failed !!!"
    //         });
    //     });

    return Question.findOneAndUpdate(
        { "_id": mongoose.Types.ObjectId(req.params.id) },
        // { $set: req.body }
        { isDeleted: true }
    ).then((result) => {
        return res.send({
            status: true,
            data: { ...result._doc, ...{ isDeleted: true } },
            error: null
        })
    }).catch((err) => {
        return res.send({
            status: false,
            data: null,
            error: "Delete Failed !!!!"
        })
    });




}


const single_ques_fetch = (req, res) => {
    return Question.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(req.params.id), "status": true, "isDeleted": false }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "questionUserDetails"
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
                            status: 0,
                            isDeleted: 0,
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
                            questionId: 0,
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        __v: 0,
                                        isDeleted: 0,
                                        email: 0,
                                        password: 0,
                                        status: 0,
                                        createOn: 0
                                    }
                                }
                            ],
                            as: "answersUserDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "votes",
                            localField: "_id",
                            foreignField: "ques_ans_id",
                            pipeline: [
                                { $match: { "ques_ans_type": "answer", isDeleted: false, status: true, like_dislike_type: "like" } },
                            ],
                            as: "answer_likes"
                        }
                    },
                    {
                        $addFields: { answerLikeCount: { $size: "$answer_likes" } }
                    },
                    {
                        $lookup: {
                            from: "votes",
                            localField: "_id",
                            foreignField: "ques_ans_id",
                            pipeline: [
                                { $match: { "ques_ans_type": "answer", isDeleted: false, status: true, like_dislike_type: "dislike" } },
                            ],
                            as: "answer_dislikes"
                        }
                    },
                    {
                        $addFields: { answerDislikeCount: { $size: "$answer_dislikes" } }
                    },
                    {
                        $addFields: { totalAnswerVoteCount: { $add: ["$answerLikeCount", "$answerDislikeCount"] } }
                    },
                    {
                        $project:{
                            answer_likes:0,
                            answer_dislikes:0
                        }
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
        { $unwind: "$questionUserDetails" },
        { $unwind: "$categoryDetails" },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                tag: 0,
                category: 0,
                userId: 0,
                likes: 0,
                dislikes: 0
            },
        },
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
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
            error: "Something Went Wrong !!",
        });
    });
}

const no_answered_ques = (req, res) => {
    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
            }
        },
        {
            $addFields: { answerCount: { $size: "$answers" } }
        },
        {
            $match: { "answerCount": 0 }
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
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        {
            $sort: {
                _id: -1
            }
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: 'No Question Found !!!'
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });
}

const most_answered_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
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
            $sort: {
                "answerCount": -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });

}


const category_wise_all_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, category: mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            status: 0,
                            isDeleted: 0,
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
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                tag: 0,
                category: 0,
                userId: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            }
        },
        { $unwind: "$userDetails" },
        { $unwind: "$categoryDetails" },
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });

}


const category_wise_no_answered_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, category: mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
            }
        },
        {
            $addFields: { answerCount: { $size: "$answers" } }
        },
        {
            $match: { "answerCount": 0 }
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
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        {
            $sort: {
                _id: -1
            }
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: 'No Question Found !!!'
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });

}


const category_wise_most_answered_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, category: mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
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
            $sort: {
                "answerCount": -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            }
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }

    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });


}


const tag_wise_all_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, 'tag.tagId': mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            status: 0,
                            isDeleted: 0,
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
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                tag: 0,
                category: 0,
                userId: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            }
        },
        { $unwind: "$userDetails" },
        { $unwind: "$categoryDetails" },
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            }); d
        }

    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });


}


const tag_wise_unanswered_ques = (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, 'tag.tagId': mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
            }
        },
        {
            $addFields: { answerCount: { $size: "$answers" } }
        },
        {
            $match: { "answerCount": 0 }
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
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        {
            $sort: {
                _id: -1
            }
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: 'No Question Found !!!'
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });
}


const tag_wise_most_answered_ques = async (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, 'tag.tagId': mongoose.Types.ObjectId(req.params.id) }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
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
            $sort: {
                "answerCount": -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Quesions Found !!!",

            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null,

            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });
}


const search_data = async (req, res) => {

    return Question.aggregate([
        {
            $match: {
                title: { $regex: req.body.searchBy, $options: "i" },
                isDeleted: false,
                status: true
            }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            status: 0,
                            isDeleted: 0,
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
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                tag: 0,
                category: 0,
                userId: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            }
        },
        { $unwind: "$userDetails" },
        { $unwind: "$categoryDetails" },
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }

    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
        });
    });
}


const search_unanswered_question = async (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, title: { $regex: req.body.searchBy, $options: "i" } }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
            }
        },
        {
            $addFields: { answerCount: { $size: "$answers" } }
        },
        {
            $match: { "answerCount": 0 }
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
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        {
            $sort: {
                _id: -1
            }
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: 'No Question Found !!!'
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });


}


const search_most_answered_questions = async (req, res) => {

    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true, title: { $regex: req.body.searchBy, $options: "i" } }
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            __v: 0,
                            email: 0,
                            password: 0,
                            status: 0,
                            isDeleted: 0,
                            createOn: 0
                        },
                    }
                ],
                as: "userDetails"
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
                            description: 0,
                            status: 0,
                            isDeleted: 0,
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
                as: "answers",
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
            $sort: {
                "answerCount": -1
            }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0,
                category: 0,
                userId: 0,
                tag: 0,
                answers: 0,
                likes: 0,
                dislikes: 0
            },
        },
        { $unwind: "$categoryDetails" },
        { $unwind: "$userDetails" }
    ]).then((data) => {
        if (data.length == 0) {
            return res.status(200).json({
                status: false,
                data: null,
                error: "No Questions Found !!!"
            });
        } else {
            return res.status(200).json({
                status: true,
                data: data,
                error: null
            });
        }
    }).catch((error) => {
        return res.status(200).json({
            status: false,
            data: null,
            error: "Something Went Wrong !!!",
            error_code: error
        });
    });

}



module.exports = {
    create,
    viewall,
    update_data,
    delete_data,
    single_ques_fetch,
    no_answered_ques,
    most_answered_ques,
    category_wise_all_ques,
    category_wise_no_answered_ques,
    category_wise_most_answered_ques,
    tag_wise_all_ques,
    tag_wise_unanswered_ques,
    tag_wise_most_answered_ques,
    search_data,
    search_unanswered_question,
    search_most_answered_questions

}