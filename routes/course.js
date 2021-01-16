const express = require('express')
const router = express.Router();
const multer = require('multer');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const { createCourse, courseById, getCourseById, getCoursePhoto, handleSearch, renderCreateCourseForm, renderCourseUpdateForm, updateCourse,
    lessonById, addWistlist, removeWistlist, buyCourse, renderLearnCourse, calculateSearchPagingInfo, latestCoursesForSearch, 
    getCourseCategory, CoursesCategory, addComment, AliasById, renderPreview } = require('../controller/course');
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
router.get('/:courseId', getCourseCategory, CoursesCategory, getCourseById)


router.get('/photo/:courseId', getCoursePhoto)
router.post('/search', calculateSearchPagingInfo, latestCoursesForSearch, handleSearch)
router.get('/:courseId/learn/:lessonId', renderLearnCourse)
router.get('/:courseId/preview/:lessonId', renderPreview)
router.get('/:courseId/addtoWistList', addWistlist)
router.get('/:courseId/removefromWistList', removeWistlist)
router.get('/:courseId/buyCourse', buyCourse)
router.post('/:courseID',urlencodedParser, addComment)

router.param('courseId', courseById)
router.param('lessonId', lessonById)

module.exports = router;