const Vote = require("../Model/Vote");
var mongoose = require('mongoose');




const create = (req, res) => {
    let dataSet = {
        userId: req.body.userId,
        ques_ans_id: req.body.ques_ans_id,
        ques_ans_type: req.body.ques_ans_type,
        like_dislike_type: req.body.like_dislike_type,
        createOn: new Date()
    }
    return Vote.findOne({ userId: req.body.userId, ques_ans_id: req.body.ques_ans_id, ques_ans_type : req.body.ques_ans_type }, async (error, user_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (user_exists != null) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Vote Already Given !!!!',
            });
        } else {
            const dataModel = new Vote(dataSet);
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
    })
}


module.exports = {
    create
}