const express = require('express');
const router = express.Router();

const { createCategory } = require('../controller/category')
const {getCoursesByCategory}=require('../controller/course')
const {layoutMiddleWare}=require('../controller/core')

router.post('/create', createCategory);
router.get('/:fieldName/:categoryName',layoutMiddleWare,getCoursesByCategory);
router.get('/design/category/marketing/advertising',layoutMiddleWare,(req,res)=>{
    res.render('test',{
        layout: 'test'
    })
})




module.exports = router;