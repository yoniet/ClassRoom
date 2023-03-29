const Enrollment = require('../models/enrollment.model')
const errorHandler = require('../helpers/dbErrorHandler')

const findEnrollment = async (req, res, next) => {
    try {
        let enrollments = await Enrollment.find({course: req.course._id,
                                                student: req.auth._id});
        if (enrollments.length == 0) {
            next();
        } else {
            res.json(enrollments[0])
        }                                               
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const create = async (req, res) => {
    let newEnrollment = {
        course: req.course,
        student: req.auth
    }
    newEnrollment.lessonStatus = req.course.lessons.map((lesson)=> {
        return {lesson: lesson, complete: false}
    })
    const enrollment = new Enrollment(newEnrollment);
    try {
        let result = await enrollment.save()
        return res.status(200).json(result)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const enrollmentByID = async (req, res, next, id)=> {
    try {
        let enrollment = await Enrollment.findById(id)
                                .populate({path: 'course', populate: {
                                    path: 'instructor'
                                }})
                                .populate('student', '_id name');
        if (!enrollment) {
            return res.status('400').json({
                error: "Enrollment not found"
            })
        }
        req.enrollment = enrollment
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve enrollment"
        })
    }
}

const isStudent = (req, res, next) => {
    console.log('this method in enrollment.controller: ', req.aut, ' --- ', req.auth._id)
    const isStudent = req.auth && req.auth._id == req.enrollment.student._id

    if (!isStudent) {
        return res.status('403').json({
            error: 'User is not enrolled'
        })
    }
    next()
}

const read = (req, res) => {
    return res.json(req.enrollment)
}

module.exports = {
    findEnrollment,
    create,
    enrollmentByID,
    isStudent,
    read
}