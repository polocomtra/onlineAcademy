const express = require('express');
const router = express.Router();

const { getAllCourses, getCoursesKind } = require('../controller/course')


router.get('/', getCoursesKind, getAllCourses);


module.exports = router;