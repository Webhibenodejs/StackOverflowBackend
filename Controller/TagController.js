const Tag = require("../Model/Tag");
var mongoose = require('mongoose');


const create = (req, res) => {
    let dataSet = {
        tag: req.body.tag,
        description : req.body.description,
        createOn: new Date()
    }
    const dataModel = new Tag(dataSet);
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
                error: "Something Went Wrong !!"
            })
        });
}

const viewall = (req, res) => {
    return Tag.aggregate([
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
    return Tag.findOneAndUpdate(
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
   
    return Tag.findOneAndUpdate(
        { "_id": mongoose.Types.ObjectId(req.params.id) },
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


module.exports = {
    create,
    viewall,
    update_data,
    delete_data
   
}