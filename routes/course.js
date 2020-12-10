const express = require('express')
const router = express.Router();

const { createCourse, courseById, getCourseById, getCoursePhoto } = require('../controller/course')

router.post('/create', createCourse)
router.get('/:courseId', getCourseById)
router.get('/photo/:courseId', getCoursePhoto)

router.param('courseId', courseById)

module.exports = router;