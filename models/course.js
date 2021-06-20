const mongoose = require('mongoose')

const { Schema } = mongoose

const { ObjectId } = mongoose.Schema

const lessonSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    Slug: {
        type: String
    }
    ,
    description: {
        type: String,
        trim: true,
        required: true,
    },
    lessonVideo:[ {type:String}],
    free_preview: {
        type: Boolean,
        default: false
    },
    Author: {
        type: ObjectId,
        ref: 'User',
        required: true
    }


}, { timestamps: true }
)

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    points:[{ type:Array }],
    description: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        default: 499
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type:String,
        required:true
    },
    Slug: {
        type: String
    },
    Author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    lessons: [lessonSchema]

}, { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)