const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    alias: {
        type: String,
        trim: true,
        required: true
    },
    field: {
        type: ObjectId,
        ref: "Field",
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema);