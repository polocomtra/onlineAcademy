
const Category = require("../model/Category");
const Course = require("../model/Course");
const Field = require("../model/Field");
const User = require("../model/User");
const _ = require('lodash');
const cryptoJs = require('crypto-js');
const { stubArray } = require('lodash');


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
    const { username, email, publicinfo,newPassword } = req.body;
    let hashed_password= cryptoJs.AES.encrypt(newPassword, process.env.KEY_ENCRYPT).toString()
    const updateInfo = { username, email,hashed_password, about: publicinfo };
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
        res.render('admin/management/user/updateUser', {
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
        res.render('admin/management/user/updateUser', {
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
        res.render('admin/management/user/deleteUser', {
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
    res.render('admin/management/category/addCategory', {
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
            res.render('admin/management/category/addCategory', {
                fields: res.locals.fields,
                successMessage: 'Create new category successfully'
            })
        })
    })
}

exports.renderUpdateCategoryForm = async (req, res) => {
    await Category.findOne({ _id: req.params.categoryId }).populate('field').exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/category/updateCategory', {
            successMessage: false,
            category: result
        })
    })
}

exports.updateCategory = async (req, res) => {
    console.log(req.body);
    const { field, fieldObjectId, category, alias } = req.body;
    const updateInfo = { name: category, alias };
    await Category.findByIdAndUpdate(req.params.categoryId, updateInfo, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/category/updateCategory', {
            successMessage: 'Update category successfully',
            category: result
        })
    })
}

exports.renderDeleteCategoryForm = async (req, res) => {
    await Category.findOne({ _id: req.params.categoryId }).populate('field').exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/category/deleteCategory', {
            category: result,
            courseExistMessage: false
        })
    })
}
exports.renderAllCourses = (req, res) => {
    var myCourse = [];
    var replay = [];
    var isDone = [];
    Course.find().exec((err, courses) => {
        if (err) {
            console.log(err)
        }
        for(var i=0;i<courses.length;i++)
        {
            for(var j=0;j<courses[i].students.length;j++)
            {
                if(courses[i].students[j].student == res.locals.user._id)
                {
                    myCourse.push(courses[i]);
                    replay.push(courses[i].students[j].replay);
                    isDone.push(courses[i].students[j].isDone)
                }
            }
        }
        res.render('user/learning/all-courses', {
            courses: myCourse,
            replay: replay,
            isDone: isDone
        });
    })
    
}

exports.renderCollection = (req, res) => {
    res.render('user/learning/collection', {
        user: res.locals.user
    });
}

exports.renderWistlist = (req, res) => {
    var wistlist = [];
    if(res.locals.user._id!=null)
    {
        var length = res.locals.user.wistlist.length;
    for (var i = 0; i < length; i++) {
        wistlist[i] = res.locals.user.wistlist[i].course;
    }
    }
    Course.find({ _id: { "$in": wistlist } }).exec((err, course) => {
        if (err) {
            console.log(err)
        }
        res.render('user/learning/wistlist', {
            courses: course

        })
    })
}


exports.findCourseExist = async (req, res, next) => {
    await Course.find({ category: req.params.categoryId }).exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.locals.courseExist = result.length;
        next();
    })
}

exports.deleteCategory = async (req, res) => {

    if (!res.locals.courseExist) {
        await Category.findByIdAndDelete(req.params.categoryId, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            }
            res.redirect('/user/admin/categories')
        })
    } else {
        await Category.findOne({ _id: req.params.categoryId }).populate('field').exec((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: err
                })
            }
            res.render('admin/management/category/deleteCategory', {
                category: result,
                courseExistMessage: 'Sorry this category has courses!'
            })
        })
    }
}

exports.renderDeleteCourseForm = async (req, res) => {
    await Course.findOne({ _id: req.params.courseId }).populate('teacher').populate('category').exec((err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.render('admin/management/course/deleteCourse', {
            course: result,
        })
    })
}

exports.deleteCourse = async (req, res) => {
    await Course.findByIdAndDelete(req.params.courseId, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: err
            })
        }
        res.redirect('/user/admin/courses')
    })
}

exports.renderArchived = (req, res) => {
    res.render('user/learning/archived', {
        user: res.locals.user
    });
}

exports.renderAddTeacherForm=(req,res)=>{
    res.render('admin/management/user/addTeacher',{
        successMessage:false
    })
}

exports.addTeacher=(req,res)=>{
    const {username,password,role}=req.body
    let newEmail=username+`@email.com`;
    const newAccount={name:username,email:newEmail,password,role}
    const newTeacher=new User(newAccount);
    newTeacher.save((err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error:err
            })
        }
        res.render('admin/management/user/addTeacher',{
            successMessage: 'Create new teacher account successfully'
        })
    })
}