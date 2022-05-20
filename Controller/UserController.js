const User = require("../Model/User");
var mongoose = require('mongoose');



const viewall_user = (req, res) => {

    return User.aggregate([
        {
            $project: {
                __v: 0,
                password : 0,
                createOn : 0
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



module.exports = {
    viewall_user
    // viewall,
    // update_data,
    // delete_data
}