const express = require('express')

const authCtrl = require('../controllers/auth.controller');
const enrollmentCtrl = require('../controllers/enrollment.controller');
const courseCtrl = require('../controllers/course.controller')

const router = express.Router()

router.route('/api/enrollment/new/:courseId')
    .post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment,
        enrollmentCtrl.create)

router.route('/api/enrollment/:enrollmentId')
    .get(authCtrl.requireSignin, enrollmentCtrl.isStudent,
        enrollmentCtrl.read)

router.param('enrollmentId', enrollmentCtrl.enrollmentByID)
router.param('courseId', courseCtrl.courseByID)

module.exports = router;