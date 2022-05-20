const SignUp = require("../../Model/User");
var passwordHash = require('password-hash');
const create = (req, res) => {
    let dataSet = {
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        terms_conditions: req.body.terms_conditions,
        createOn: new Date()
    }

    const dataModel = new SignUp(dataSet);

    if (req.body.terms_conditions == true) {
        dataModel.save()
            .then((result) => {
                return res.send({
                    status: true,
                    data: result,
                    error: null
                })
            }).catch((err) => {
                var error_msg = "";
                if (err.code == 11000) {
                    error_msg = "Email Already Exists !!!!";
                } else {
                    error_msg = "Something Went Wrong";
                }

                return res.send({
                    status: false,
                    data: null,
                    error: error_msg
                })
            });
    } else {
        return res.send({
            status: false,
            data: null,
            error: "Please Check Checkbox !!!"
        })
    }


}



module.exports = {
    create
}