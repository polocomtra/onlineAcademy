const Course = require('../model/Course')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/errorHandler')
const Category = require('../model/Category')
const coursesPerPageNum = parseInt(process.env.COURSES_PER_PAGE);

exports.createCourse = async (req, res) => {
    const teacher = res.locals.user._id;
    let categoryObjectId;
    let content = [];
    let status = (req.body.status === 'true');
    //Handle content, doan xu li nay nhieu não vl
    let chapterCount = parseInt(req.body.chapterCount);
    for (let i = 1; i <= chapterCount; i++) {
        let chapterSeries = {};
        let lessonCountPerChapter = `lessonCountForChapter${i}`;
        let chapterTitle = `chapter${i}`;
        let lessonPerChapter = 0;
        for (let item of Object.keys(req.body)) {
            if (item == chapterTitle) {
                chapterSeries.name = req.body[item];
            }
            if (item == lessonCountPerChapter) {
                chapterSeries.chapter = [];
                lessonPerChapter = req.body[item].length;
                for (let j = 1; j <= lessonPerChapter; j++) {
                    let lessonTitle = `lesson${j}ForChapter${i}`;
                    for (let title of Object.keys(req.body)) {
                        if (title == lessonTitle) {
                            chapterSeries.chapter.push({ lesson: req.body[title] });
                        }
                    }
                }

            }
        }
        content.push(chapterSeries);
    }
    const { name, category, price, description, detailDes } = req.body;
    //Phải có tên, thể loại, giảng viên
    if (!name || !category || !teacher) {
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    await Category.findOne({ name: category }).exec((err, category) => {
        if (err) {
            console.log(err);
            return;
        }
        categoryObjectId = category._id;
        console.log(content)
        const newCourse = { status, name, category: categoryObjectId, teacher, price, description, detailDes, content };
        let course = new Course(newCourse);
        if (req.files.photo[0]) {
            course.photo.data = fs.readFileSync(req.files.photo[0].path);
            course.photo.contentType = req.files.photo[0].mimetype;
        }
        course.save((err, result) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.render('course/addCourseForm', {
                successMessage: 'Add course successfully.'
            })
        })
    })

}

exports.courseById = (req, res, next) => {
    const id = req.params.courseId;
    Course.findById(id).populate('category').populate('teacher').exec((err, course) => {
        if (err || !course) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.course = course
        next();
    })

}

exports.getCoursesKind = async (req, res, next) => {
    //All
    await Course.find().limit(10).exec((err, courses) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        req.session.top10Courses = courses;
    })
    //Most viewed & featured
    await Course.find().sort({ view: -1 }).limit(10).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        req.session.mostViewedCourses = courses;
        req.session.featuredCourses = courses;
    })
    //Latest
    await Course.find().sort({ createdAt: -1 }).limit(10).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        req.session.latestCourses = courses;
    })
    next();
}
//Top 5 courses with same category
//Business


//

exports.getAllCourses = (req, res) => {
    //all courses
    Course.find().populate('category').populate('teacher').exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.render('core/home', {
            categories: res.locals.categories,
            fields: res.locals.fields,
            courses: courses,
            mostViewedCourses: req.session.mostViewedCourses,
            featuredCourses: req.session.featuredCourses,
            latestCourses: req.session.latestCourses,
            top10Courses: req.session.top10Courses
        })
    })
}
exports.getPagingInfo = async (req, res, next) => {
    let total = 0;
    let coursesPerPage = coursesPerPageNum;
    let pages = 0;
    let pagesArray = [];
    await Course.find().exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        total = courses.length;
        pages = (total % coursesPerPage == 0) ? total / coursesPerPage : Math.floor(total / coursesPerPage) + 1;
        for (let i = 1; i <= pages; i++) {
            const item = {
                value: i
            }
            pagesArray.push(item);
        }
        req.session.pages = pagesArray;
    })
    next();
}

exports.getAllCoursesByPage = (req, res) => {
    let skipOffset = (req.query.p - 1) * coursesPerPageNum;
    Course.find().populate('category').populate('teacher').skip(skipOffset).limit(coursesPerPageNum).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.render('course/courses', {
            courses: courses,
            pages: req.session.pages
        })
    })
}

exports.getCourseById = async (req, res) => {
    req.course.photo = undefined;
    let { view } = req.course;
    let update = { view: view + 1 };
    await Course.findByIdAndUpdate({ _id: req.course._id }, update, { new: true })
    Course.findOne({ _id: req.course._id }).populate('category').populate('teacher').populate('reviews.reviewer').select('-photo').exec((err, course) => {
        if (err) {
            console.log(err)
        }
        res.render('course/detailCourse', {
            course: course
        })
    })
}

exports.getCoursePhoto = (req, res, next) => {
    if (req.course.photo.data) {
        res.set('Content-Type', req.course.photo.contentType)
        res.send(req.course.photo.data)
    }
    next()
}

exports.getCoursesByCategory = (req, res) => {
    const { fieldName, categoryName } = req.params;
    Course.find().populate('category').exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/coursesByCategory', {
            courses: courses.filter(course => course.category.alias == categoryName)
        })
    })
}

exports.getPagingInfoForSearch = async (req, res, next) => {
    let total = 0;
    let coursesPerPage = coursesPerPageNum;
    let pages = 0;
    let pagesArray = [];
    let query = req.query.q;
    await Course.find({ $text: { $search: query } }).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        total = courses.length;
        pages = (total % coursesPerPage == 0) ? total / coursesPerPage : Math.floor(total / coursesPerPage) + 1;
        for (let i = 1; i <= pages; i++) {
            const item = {
                value: i
            }
            pagesArray.push(item);
        }
        req.session.pagesForSearch = pagesArray;
    })
    next();
}

exports.handleSearch = async (req, res) => {
    let query = req.query.q;
    let skipOffset = (req.query.p - 1) * coursesPerPageNum;
    let total = 0;
    let coursesPerPage = coursesPerPageNum;
    let pages = 0;
    let pagesArray = [];
    await Course.find({ $text: { $search: query } }).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        total = courses.length;
        pages = (total % coursesPerPage == 0) ? total / coursesPerPage : Math.floor(total / coursesPerPage) + 1;
        for (let i = 1; i <= pages; i++) {
            const item = {
                value: i
            }
            pagesArray.push(item);
        }
    })
    await Course.find({ $text: { $search: query } }).skip(skipOffset).limit(coursesPerPageNum).exec((err, courses) => {
        if (err) {
            console.log(err)
        }
        res.render('course/coursesForSearch', {
            courses: courses,
            pages: pagesArray,
            query: query
        })
    })
}

exports.renderCreateCourseForm = (req, res) => {
    res.render('course/addCourseForm', {
        fields: res.locals.fields,
        successMessage: false
    });
}

exports.renderCourseUpdateForm = (req, res) => {
    Course.findOne({ _id: req.params.courseId }).populate('category').exec((err, course) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/courseUpdate', {
            course: course,
            successMessage: false
        })
    })
}

exports.updateCourse = async (req, res) => {
    let content = [];
    let status = (req.body.status === 'true');
    //Handle content, doan xu li nay nhieu não vl
    let chapterCount = parseInt(req.body.chapterCountUpdate);
    //Neu khong thay doi thong tin gi
    if (!chapterCount) {
        res.render('course/courseUpdate', {
            successMessage: 'Cannot update.Chapter needed'
        })
    }
    for (let i = 1; i <= chapterCount; i++) {
        let chapterSeries = {};
        let lessonCountPerChapter = `lessonCountForChapter${i}`;
        let chapterTitle = `chapter${i}`;
        let lessonPerChapter = 0;
        for (let item of Object.keys(req.body)) {
            if (item == chapterTitle) {
                chapterSeries.name = req.body[item];
            }
            if (item == lessonCountPerChapter) {
                chapterSeries.chapter = [];
                lessonPerChapter = +req.body[item];
                for (let j = 1; j <= lessonPerChapter; j++) {
                    let lessonTitle = `lesson${j}ForChapter${i}`;
                    for (let title of Object.keys(req.body)) {
                        if (title == lessonTitle) {
                            chapterSeries.chapter.push({ lesson: req.body[title] });
                        }
                    }
                }

            }
        }
        content.push(chapterSeries);
    }
    const { name, price, description, detailDes } = req.body;
    const updateInfo = { name, price, description, detailDes, content, status }
    console.log(req.params.courseId);
    await Course.findByIdAndUpdate(req.params.courseId, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/courseUpdate', {
            course: result,
            successMessage: 'Update course successfully'
        })

    })
}