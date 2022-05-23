var mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    blog_desc: {
        type: String,
        required: true
    },
    blog_image: {
        type: String,
        required: true
    },
    blog_writer: {
        type: String,
        required: true
    },
    status: {
        type : Boolean,
        default : true,
        required : true
    },
    isDeleted: {
        type : Boolean,
        default : false,
        required : true
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Blog', BlogSchema);