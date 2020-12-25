const Course = require('../model/Course')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/errorHandler')

exports.createCourse = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }
        const { name, category, teacher, price, description } = fields;
        if (!name || !category || !teacher || !price || !description) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }
        let course = new Course(fields);
        if (files.photo) {
            course.photo.data = fs.readFileSync(files.photo.path);
            course.photo.contentType = files.photo.type;
        }
        course.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result)
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

        res.locals.top10Courses = courses;

    })
    //Most viewed & featured
    await Course.find().sort({ view: -1 }).limit(10).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.locals.mostViewedCourses = courses;
        res.locals.featuredCourses = courses;
    })
    //Latest
    await Course.find().sort({ createdAt: -1 }).limit(10).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.locals.latestCourses = courses;
    })

    next();
}

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
            mostViewedCourses: res.locals.mostViewedCourses,
            featuredCourses: res.locals.featuredCourses,
            latestCourses: res.locals.latestCourses,
            top10Courses: res.locals.top10Courses
        })
    })
}
exports.getPagingInfo = async (req, res, next) => {
    let total;
    let coursesPerPage = 4;
    let pages;
    let pagesArray = [];
    let skipOffset;
    let currentPage = req.query.p;
    if (currentPage) {
        skipOffset = coursesPerPage * currentPage;
    } else {
        skipOffset = 0;
    }
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
    let skipOffset = (req.query.p - 1) * 4;
    Course.find().populate('category').populate('teacher').skip(skipOffset).limit(4).exec((err, courses) => {
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
    Course.findOne({ _id: req.course._id }).populate('category').populate('teacher').select('-photo').exec((err, course) => {
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
    console.log(`Field:${fieldName},category:${categoryName}`);
    Course.find().populate('category').exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/coursesByCategory', {
            courses: courses.filter(course => course.category.alias == categoryName),
        })
    })
}

exports.handleSearch = (req, res) => {
    let query = req.query.q;
    Course.find({ $text: { $search: query } }).exec((err, courses) => {
        if (err) {
            console.log(err)
        }
        res.render('course/courses', {
            courses: courses
        })
    })
}