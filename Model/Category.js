var mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createOn: {
        type: Date
    }
});

module.exports = mongoose.model('Category', CategorySchema);