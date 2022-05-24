const Contacts = require("../Model/ContactUs");
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');



const send_mails = (req, res) => {
    let dataSet = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message,
        createOn: new Date()
    }
    const dataModel = new Contacts(dataSet);

    dataModel.save()
        .then((result) => {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'betalritam@gmail.com',
                    pass: 'Vogobanjane2@'
                }
            });

            var mailOptions = {
                from: result._doc.email,
                to: 'ritamraj869@gmail.com',
                subject: result._doc.subject,
                html: '<p><b>Sender Name : </b> '+result._doc.name+' </p><p><b>Sender Email : </b> '+result._doc.email+' </p><p><b>Sender Phone : </b> '+result._doc.phone+' </p><p><b>Message : </b>'+result._doc.message+' </p>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.send({
                        status: false,
                        data: null,
                        error: error
                    })
                } else {
                    return res.send({
                        status: true,
                        data: "Email Sent Succesfully !!!!",
                        error: null
                    })

                }
            });
        }).catch((err) => {
            return res.send({
                status: false,
                data: null,
                error: err
            })
        });


}






module.exports = {
    send_mails
}