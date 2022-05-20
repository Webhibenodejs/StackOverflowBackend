const User = require("../Model/User");
var mongoose = require('mongoose');



const viewall_user = (req, res) => {
    return User.aggregate([
        {
            $project: {
                __v: 0,
                password : 0
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
            $match : { "_id": mongoose.Types.ObjectId(req.params.id), "isDeleted": false },
        },
        {
            $project: {
                __v: 0,
                password : 0
            },
        }
    ])
        .then((data) => {
            if(data.length == 0) {
                return res.status(200).json({
                    status: false,
                    data: null,
                    error : "User Not Found !!!"
                });
            } else {
                return res.status(200).json({
                    status: true,
                    data: data[0],
                    error : null
                });
            }

            
        })
        .catch((error) => {
            return res.status(200).json({
                status: false,
                data : null,
                error: "Something Went Wrong !!"
            });
        });
}




module.exports = {
    viewall_user,
    single_use_fetch
    // viewall,
    // update_data,
    // delete_data
}