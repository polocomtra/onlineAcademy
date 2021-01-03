const express = require('express');
const router = express.Router();

const { getAllCourses, getAllCoursesByPage, handleSearch, getCoursesKind } = require('../controller/course')


router.get('/', getCoursesKind, getAllCourses);
router.get('/courses', getAllCoursesByPage);
router.get('/courses/search', handleSearch);


module.exports = router;