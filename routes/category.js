const express = require('express');
const router = express.Router();

const { createCategory } = require('../controller/category')
const {getCoursesByCategory}=require('../controller/course')

router.post('/create', createCategory);
router.get('/:fieldName/:categoryName',getCoursesByCategory);
router.get('/design/category/marketing/advertising',(req,res)=>{
    res.render('test')
})




module.exports = router;