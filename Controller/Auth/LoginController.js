const User = require("../../Model/User");
var passwordHash = require('password-hash');


const login = (req, res) => {
  
    return User.aggregate([
        {
            $match : { email : req.body.email, password : req.body.password, status : true, isDeleted : false }
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
    login
}