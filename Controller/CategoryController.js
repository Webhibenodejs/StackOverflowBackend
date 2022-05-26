const Category = require("../Model/Category");
var mongoose = require('mongoose');
const { exists } = require("../Model/Category");


const create = (req, res) => {
    let dataSet = {
        name: req.body.cat_name,
        createOn: new Date()
    }

    return Category.findOne({ name: req.body.cat_name }, async (error, category_exists) => {
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (category_exists != null) {
            if ((category_exists.isDeleted == false) || (category_exists.status == true)) {
                res.status(200).json({
                    status: false,
                    data: null,
                    error: 'This Category is either Deactivated or Deleted !!!!'
                });
            } else {
                res.status(200).json({
                    status: false,
                    data: null,
                    error: 'This Category Exists!!!!'
                });
            }
        } else {
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
    });
}

const viewall = (req, res) => {
    return Category.aggregate([
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
    return Category.findOne({ name: req.body.cat_name }, async (error, category_exists) => {
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>',category_exists);
        // return  false;
        if (error) {
            res.status(200).json({
                status: false,
                data: null,
                error: 'Something Went Wrong !!!!'
            });
        } else if (category_exists != null) {
            if ((category_exists._id != mongoose.Types.ObjectId(req.params.id)) && (category_exists.name == req.body.cat_name)) {
                return res.send({
                    status: false,
                    data: null,
                    error: "This Category Exists!!!! Try New !!"
                })
            } 
        } else {
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
    });










}

const delete_data = (req, res) => {
    // return Category.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
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


    return Category.findOneAndUpdate(
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


module.exports = {
    create,
    viewall,
    update_data,
    delete_data
}