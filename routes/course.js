const express = require('express')
const router = express.Router();
const multer = require('multer');

const { createCourse, courseById, getCourseById, getCoursePhoto, handleSearch, renderCreateCourseForm, renderCourseUpdateForm, updateCourse } = require('../controller/course');
const { isPro } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage });

router.post('/create', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 10 }]), createCourse)
router.get('/create', isPro, layoutMiddleWare, renderCreateCourseForm)
router.get('/update/:courseId', isPro, renderCourseUpdateForm)
router.post('/update/:courseId', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 10 }]), updateCourse)
router.get('/:courseId', getCourseById)
router.get('/photo/:courseId', getCoursePhoto)
router.post('/search', handleSearch)


router.param('courseId', courseById)

module.exports = router;