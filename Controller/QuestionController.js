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
                error: err,
                error_test: req.body
            })
        });
}

const viewall = (req, res) => {
    return Question.aggregate([
        {
            $match: { isDeleted: false, status: true }
        },
        {
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0
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
            $project: {
                __v: 0,
                status: 0,
                isDeleted: 0
            },
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
    ])
        .then((data) => {
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
        })
        .catch((error) => {
            return res.status(200).json({
                status: false,
                data: null,
                error: "Something Went Wrong !!",
            });
        });
}


module.exports = {
    create,
    viewall,
    update_data,
    delete_data,
    single_ques_fetch
}