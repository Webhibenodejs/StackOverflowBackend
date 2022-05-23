const Blog = require("../Model/Blog");
var mongoose = require('mongoose');




const create = (req, res) => {
    let dataSet = {
        category: req.body.category,
        title: req.body.title,
        blog_desc: req.body.blog_desc,
        blog_image: "https://templates.envytheme.com/pify/default/assets/images/blog/blog-1.jpg",
        blog_writer: req.body.blog_writer,
        createOn: new Date()
    }
    const dataModel = new Blog(dataSet);
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
    return Blog.aggregate([
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
    return Blog.findOneAndUpdate(
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
    // return Question.remove({ _id: { $in: [mongoose.Types.ObjectId(req.params.id)] } })
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

    return Blog.findOneAndUpdate(
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