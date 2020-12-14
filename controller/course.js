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

exports.getAllCourses = (req, res) => {
    console.log(res.locals.categories);
    Course.find().populate('category').populate('teacher').exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.render('course/courses', {
            categories: res.locals.categories,
            fields: res.locals.fields,
            courses: courses
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