const express = require('express');
const router = express.Router();

const { getAllCourses, getAllCoursesByPage, handleSearch } = require('../controller/course')


router.get('/', getAllCourses);
router.get('/courses', getAllCoursesByPage);
router.get('/courses/search', handleSearch);


module.exports = router;