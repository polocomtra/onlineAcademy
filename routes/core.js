const express = require('express');
const router = express.Router();

const { getAllCourses } = require('../controller/course')


router.get('/', getAllCourses);


module.exports = router;