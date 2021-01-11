const express = require('express');
const router = express.Router();

const { createCategory } = require('../controller/category')
const { getCoursesByCategory, calculatePagingInfoForCategory } = require('../controller/course')

router.post('/create', createCategory);
router.get('/:fieldName/:categoryName', calculatePagingInfoForCategory, getCoursesByCategory);




module.exports = router;