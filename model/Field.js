const mongoose = require('mongoose')


const fieldSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    alias: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Field', fieldSchema);