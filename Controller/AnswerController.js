var mongoose = require('mongoose');
const Answer = require("../Model/Answer");




const create = (req, res) => {
    let dataSet = {
        question_id: req.body.question_id,
        user_id: req.body.user_id,
        user_type_guest: req.body.user_type_guest,
        name: req.body.name,
        email: req.body.email,
        answer: req.body.answer,
        createOn: new Date()
    }
    const dataModel = new Answer(dataSet);
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
                error: "Something Went Wrong !!!"
            })
        });
}

const viewall = (req, res) => {
    return Answer.aggregate([
        {
            $project: {
                __v: 0,
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
                error : null
            });
        })
        .catch((error) => {
            return res.status(200).json({
                status: false,
                data : null,
                error: "Something Went Wrong !!!",
            });
        });
}

const update_data = (req, res) => {
    return Answer.findOneAndUpdate(
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
    return Answer.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
        .then((data) => {
            return res.status(200).json({
                success: true,
                data: data,
                error : null
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                data: null,
                error: "Delete Failed !!!"
            });
        });
}



module.exports = {
    create,
    viewall,
    update_data,
    delete_data
}