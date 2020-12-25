const express = require('express');
const router = express.Router();

const { getAllCourses, getCoursesKind, getAllCoursesByPage } = require('../controller/course')


router.get('/', getCoursesKind, getAllCourses);
router.get('/courses', getAllCoursesByPage);


module.exports = router;