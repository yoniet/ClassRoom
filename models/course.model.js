const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: String,
    content: String,
    resource_url: String
})

const Lesson = mongoose.model('Lesson', LessonSchema)

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    published: {
        type: Boolean,
        default: false
    },
    // The 'instructor' field will reference the user who created the course:
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    /**
        The created and updated fields will
        be Date types, with created generated when a new course is added,
        and updated changed when any course details are modified:
     */
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },

    lessons: [LessonSchema]
})

module.exports = mongoose.model('Course', CourseSchema)