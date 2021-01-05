const Course = require("../model/Course");
const User = require("../model/User");

exports.renderProfile = (req, res) => {
    res.render('user/profile', {
        user: res.locals.user,
        fields: res.locals.fields,
        successMessage: false
    });
}

exports.isPro = (req, res, next) => {
    if (res.locals.user.role == 2 || res.locals.user.role == 3) {
        next();
    } else {
        return res.status(400).json({
            error: "You are not authorized"
        })
    }
}

exports.coursesByUser = async (req, res) => {
    await Course.find().populate('teacher').exec((err, courses) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('course/coursesByUser', {
            courses: courses.filter(course => course.teacher._id == res.locals.user._id)
        })
    })
}

exports.updateProfile = async (req, res) => {
    console.log(req.body);
    const { username, email, publicinfo } = req.body;
    const updateInfo = { username, email, about: publicinfo };
    User.findByIdAndUpdate(res.locals.user._id, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('user/profile', {
            user: result,
            successMessage: 'Update info successfully'
        })
    })
}