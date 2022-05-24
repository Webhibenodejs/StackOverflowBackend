const User = require("../Model/User");
var mongoose = require('mongoose');
const { use } = require("express/lib/router");



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
            $project: {
                __v: 0,
                password: 0
            },
        }
    ])
        .then((data) => {
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


        })
        .catch((error) => {
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
    return User.findOne({ _id: mongoose.Types.ObjectId(req.params.id), status: true, isDeleted: false, password : req.body.oldPassword  }, async (error, user_exists) => {
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
                { $set: {password : req.body.newPassword} }
            ).then((result) => {
                return res.send({
                    status: true,
                    // data: { ...result._doc, ...req.body },
                    data : "Password Changed Succesfully",
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
    // delete_data
}