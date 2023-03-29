const formidable = require('formidable')
const fs = require('fs')
const Course = require('../models/course.model')
const extend = require('lodash/extend')
const errorHandler = require('../helpers/dbErrorHandler')
const path = require('path')
const courseImageDefault = path.join(__dirname, '../public/images/', 'defaultImage.jpg')

// This method will query the "Course" collection in the database in order to
// get the matching courses
// In the query to the "Course" collection, we find all the courses that have
// an "instructor" field that matches the user specified with the "userId" param
const listByInstructor = (req, res) => {
    Course.find({ instructor: req.profile._id }, (err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(courses)
    }).populate('instructor', '_id name')
}

const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        let course = new Course(fields)
        course.instructor = req.profile
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.type
        }
        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
    })
}

const courseByID = async (req, res, next, id) => {
    try {
        let course = await Course.findById(id)
            .populate('instructor', '_id name');
        if (!course) {
            return res.status('400').json({
                error: "Course not found"
            })
        }
        req.course = course
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve course"
        })
    }
}

const read = (req, res) => {
    // We are removing the image field before sending the "response",
    // since images will be retrieved as files in separate routes
    req.course.image = undefined;
    return res.json(req.course)
}

const isInstructor = (req, res, next) => {
    const isInstructor = req.course && req.auth &&
                            req.course.instructor._id == req.auth._id
    if (!isInstructor) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

const newLesson = async (req, res) => {
    try {
        let lesson = req.body.lesson
        let result = await Course.findByIdAndUpdate(req.course._id,
                                        {$push: {lessons: lesson},
                                        updated: Date.now()},
                                        {new: true}
                                        ).populate('instructor', '_id name')
                                        .exec()
        res.json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files)=> {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        let course = req.course
        // This function 'extend()' allow you merge the contents of two
        // or more objects together into a single object.
        // 'course' is destination and 'fields' is resource
        course = extend (course, fields)
        // This check whether the lessons field was received, and
        // assign it separately after parsing it.
        if (fields.lessons) {
            course.lessons = JSON.parse(fields.lessons)
        }
        course.updated = Date.now()
        if (files.image) {
            course.image.data = fs.readFileSync(files.image.filepath)
            course.image.contentType = files.image.type
        }

        try {
            let result = await course.save()
            res.json(result)
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }   

    })
}

const remove = async (req, res) => {
    try {
        let course = req.course;
        let deleteCourse = await course.remove()
        res.json(deleteCourse)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const listPublished = (req, res) => {
    Course.find({published: true}, (err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            })
        }
        res.json(courses)
    })
}

const photo = (req, res, next) => {
    if (req.course.image.data) {
        res.set("Content-Type", req.course.image.contentType)
        return res.send(req.course.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(courseImageDefault)
}

module.exports = {
    listByInstructor,
    create,
    courseByID,
    read,
    isInstructor,
    newLesson,
    update,
    remove,
    listPublished,
    photo,
    defaultPhoto,
}