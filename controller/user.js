const Category = require("../model/Category");
const Course = require("../model/Course");
const Field = require("../model/Field");
const User = require("../model/User");

exports.renderProfile = (req, res) => {
    res.render('user/profile', {
        user: res.locals.user,
        field: res.locals.fields,
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

exports.isAdmin = (req, res, next) => {
    if (res.locals.user.role == 3) {
        next();
    } else {
        return res.status(400).json({
            error: "You are not authorized"
        })
    }
}

exports.getAllCoursesByAdmin = async (req, res) => {
    await Course.find().populate('category').populate('teacher').exec((err, courses) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/allCourses', {
            courses: courses
        })
    })
}

exports.getAllCategoriesByAdmin = async (req, res) => {
    await Category.find().exec((err, categories) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/allCategories', {
            categories: categories
        })
    })
}

exports.getAllUsersByAdmin = async (req, res) => {
    await User.find().exec((err, users) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/allUsers', {
            users: users
        })
    })
}


exports.renderUpdateUserForm = async (req, res) => {
    await User.findOne({ _id: req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/updateUser', {
            fields: res.locals.fields,
            user: result,
            successMessage: false
        });
    })

}


exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    const updateInfo = { name, email, role };
    await User.findByIdAndUpdate(req.params.userId, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/updateUser', {
            fields: res.locals.fields,
            user: result,
            successMessage: `Update user's info successfully`
        });
    })
}

exports.renderDeleteUserForm = async (req, res) => {
    await User.findOne({ _id: req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/deleteUser', {
            fields: res.locals.fields,
            user: result,
            successMessage: false
        });
    })
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.userId, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.redirect('/user/admin/users')
    })
}

exports.renderAddCategoryForm = (req, res) => {
    res.render('admin/management/addCategory', {
        fields: res.locals.fields,
        successMessage: false
    })
}


exports.addCategory = async (req, res) => {
    const { field, category, alias } = req.body;
    await Field.findOne({ name: field }).exec((err, result) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: err
            })
        }
        const newCategory = { field: result._id, name: category, alias };
        const categoryObj = new Category(newCategory);
        categoryObj.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            }
            res.render('admin/management/addCategory', {
                fields: res.locals.fields,
                successMessage: 'Create new category successfully'
            })
        })
    })
}