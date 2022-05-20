var mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
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

module.exports = mongoose.model('Category', CategorySchema);