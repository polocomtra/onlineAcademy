const Course = require('../model/Course')
const User = require('../model/User')
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

exports.lessonById = (req, res, next) => {
    const id = req.params.lessonId;
    Course.findById({ _id: req.course._id }).select({}).exec((err, lesson) => {
        if (err || !lesson) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.lesson = lesson
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

exports.getCourseCategory = async (req, res, next) => {
    await Course.findOne({ _id: req.params.courseId }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        req.session.courseCategory = result.category
        next();
    })
}

exports.CoursesCategory = async (req, res, next) => {
    await Course.find({ category: req.session.courseCategory }).limit(5).exec((err, courses) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        }
        req.session.coursesCategory = courses
        next();
    })
}

exports.getCourseById = async (req, res) => {
    //IsMyCourse
    if (req.session.user != false) {
        var student = [];
        var length = req.course.students.length;
        for (var i = 0; i < length; i++) {
            student[i] = req.course.students[i].student;
        }
        var isMyCourse = false;
        User.find({ $and: [{ _id: { "$in": student } }, { _id: req.session.user._id }] }).exec((err, users) => {
            if (err) {
                console.log(err)
            }
            if (users.length < 1) {
                isMyCourse = false;
            }
            else {
                isMyCourse = true;
            }
            console.log(isMyCourse);
        })

    }
    //IsWistList
    if (req.session.user != false) {
        var length = req.session.user.wistlist.length;
        var wistlist = [];
        for (var i = 0; i < length; i++) {
            wistlist[i] = req.session.user.wistlist[i].course
        }
        var isWistList = false;
        Course.find({ $and: [{ _id: { "$in": wistlist } }, { _id: req.course._id }] }).exec((err, course) => {
            if (err) {
                console.log(err)
            }
            console.log(course.length);
            if (course.length < 1) {
                isWistList = false;
            }
            else {
                isWistList = true;
            }
        })
    }

    req.course.photo = undefined;
    let { view } = req.course;
    let update = { view: view + 1 };
    await Course.findByIdAndUpdate({ _id: req.course._id }, update, { new: true })

    Course.findOne({ _id: req.course._id }).populate('category').populate('teacher').populate('reviews.reviewer').select('-photo').exec((err, course) => {
        if (err) {
            console.log(err)
        }
        res.render('course/detailCourse', {
            course: course,
            WistList: isWistList,
            MyCourse: isMyCourse,
            coursesCategory: req.session.coursesCategory
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

exports.calculatePagingInfoForCategory = async (req, res, next) => {
    const { categoryName } = req.params;
    await Course.find().populate('category').exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        req.session.totalForCategory = courses.filter(course => course.category.alias == categoryName).length
    })
    next();
}

exports.getCoursesByCategory = (req, res) => {
    const { fieldName, categoryName } = req.params;
    const p = parseInt(req.query.p);
    let offset = (p - 1) * coursesPerPageNum;

    Course.find().populate('category').skip(offset).limit(coursesPerPageNum).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/coursesByCategory', {
            courses: courses.filter(course => course.category.alias == categoryName),
            total: req.session.totalForCategory,
            coursesPerPage: coursesPerPageNum,
            fieldName,
            categoryName
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

exports.calculateSearchPagingInfo = async (req, res, next) => {
    const { q } = req.query;

    await Course.find({ $text: { $search: q } }).exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        console.log(`Total length mdw: ${courses.length}`)
        req.session.totalForSearch = courses.length;
        next();
    })


}

exports.latestCoursesForSearch = async (req, res, next) => {
    await Course.find().limit(4).sort({ createdAt: -1 }).exec((err, courses) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        }
        req.session.latestCoursesForSearch = courses;
        next();
    })
}

exports.handleSearch = (req, res) => {
    let query = req.query.q;
    let skipOffset = (req.query.p - 1) * coursesPerPageNum;
    let coursesPerPage = coursesPerPageNum;
    Course.find({ $text: { $search: query } }).populate('teacher').skip(skipOffset).limit(coursesPerPageNum).sort({ price: 1, view: -1 }).exec((err, courses) => {
        if (err) {
            console.log(err)
        }
        res.render('course/coursesForSearch', {
            courses: courses,
            total: req.session.totalForSearch,
            coursesPerPage,
            query: query,
            latestCoursesForSearch: req.session.latestCoursesForSearch
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
        res.render('course/courseUpdate', {
            course: course,
            successMessage: false
        })
    })
}
exports.addWistlist = async (req, res) => {
    let path = req.course._id;
    let wistlist = []
    wistlist = req.session.user.wistlist
    wistlist.push({ course: path })
    const updateInfo = { wistlist }
    await User.findByIdAndUpdate(req.session.user._id, updateInfo, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.redirect('/course/' + path);
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
        res.render('course/courseUpdate', {
            course: result,
            successMessage: 'Update course successfully'
        })

    })
}


exports.removeWistlist = async (req, res) => {
    let path = req.course._id;
    let wistlist = []
    wistlist = req.session.user.wistlist
    for (var i = 0; i < wistlist.length; i++) {
        console.log(wistlist[i].course);
        console.log(path);
        console.log(wistlist[i].course == path);
        console.log(wistlist[i].course - path);
        if (wistlist[i].course == path) {
            if (i > -1) {
                wistlist.splice(i, 1);
            }
        }
    }
    console.log(wistlist);
    const updateInfo = { wistlist }
    await User.findByIdAndUpdate(req.session.user._id, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.redirect('/course/' + path);
    })

}

exports.buyCourse = async (req, res) => {
    let path = req.course._id;
    let myID = req.session.user._id
    let students = []
    students = req.course.students;
    students.push({ student: myID })
    console.log(students);
    const updateInfo = { students }
    await Course.findByIdAndUpdate(req.course._id, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.redirect('/course/' + path);
    })

}

exports.renderLearnCourse = async (req, res) => {
    let { view } = req.course;
    let update = { view: view + 1 };
    let students = []
    length = req.course.students.length;
    console.log(length);
    for (var i = 0; i < length; i++) {
        students[i] = req.course.students[i].student;
    }
    console.log(students);
    var isBought = false;
    User.find({ $and: [{ _id: { "$in": students } }, { _id: req.session.user._id }] }).exec((err, users) => {
        if (err) {
            console.log(err)
        }
        if (users.length < 1) {
            isBought = false;
        }
        else {
            isBought = true;
        }
        console.log(isBought);
    })
    await Course.findByIdAndUpdate({ _id: req.course._id }, update, { new: true })
    Course.findOne({ _id: req.course._id }).exec((err, course) => {
        if (err) {
            console.log(err)
        }
        res.render('course/learnCourse', {
            course: course,
            isBought: isBought,
            lessonID: req.params.lessonId
        })
    })
}
