const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    teacher: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    reviews: [
        {
            rated: {
                type: Number,
                required: true
            },
            body: {
                type: String,
                required: true
            }
        }
    ],
    photo: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    view: {
        type: Number,
        default: 0
    },
    students: [
        {
            student: {
                type: ObjectId,
                ref: 'User',
                required: true
            }
        }
    ],
    description: {
        type: String,
        required: true
    },
    content: [
        {
            chapter: [
                {
                    lesson: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ],
    status: {
        type: Boolean,
        default: false
    },
    isWishlist: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema);