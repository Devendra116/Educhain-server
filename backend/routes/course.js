const express = require('express')
const router = express.Router()
const {getCourses,searchCourses,createCourse,getCourseDetail,courseApproval}=require('../controllers/course')

router.get('/approval',courseApproval)
router.get('/',getCourses)
router.get('/:courseId',getCourseDetail)
router.get('/search',searchCourses)
router.post('/',createCourse)

module.exports = router