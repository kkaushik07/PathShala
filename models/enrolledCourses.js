const mongoose = require('mongoose')

const { Schema } = mongoose


const enrollerdCourses = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    Slug: {
        type: String,
        required: true
    },
    completedLessons: [{type:String}],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true }
)


module.exports = mongoose.model("Enrolled", enrollerdCourses)