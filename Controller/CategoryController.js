const Category = require("../Model/Category");
var mongoose = require('mongoose');




const create = (req, res) => {
    let dataSet = {
        name: req.body.cat_name,
        createOn: new Date()
    }
    const dataModel = new Category(dataSet);
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
    return Category.aggregate([
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
    return Category.findOneAndUpdate(
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
    return Category.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
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