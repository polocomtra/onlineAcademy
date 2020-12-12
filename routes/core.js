const express = require('express');
const router = express.Router();

const {  layoutMiddleWare } = require('../controller/core')
const { getAllCourses } = require('../controller/course')


router.get('/', layoutMiddleWare, getAllCourses);


module.exports = router;