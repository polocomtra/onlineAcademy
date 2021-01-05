const User = require('../model/User')
const Course = require('../model/Course')
const _ = require('lodash')

exports.renderProfile = (req, res) => {
    res.render('user/profile', {
        user: res.locals.user,
        fields: res.locals.fields
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

exports.renderAllCourses = (req, res) => {
    res.render('user/learning/all-courses', {
        user: res.locals.user
    });
}

exports.renderCollection = (req, res) => {
    res.render('user/learning/collection', {
        user: res.locals.user
    });
}

exports.renderWistlist = (req, res) => {
    var length = res.locals.user.wistlist.length;
    var wistlist =[];
    for(var i = 0 ;i < length; i++)
    {
        wistlist[i] = res.locals.user.wistlist[i].course;
    }
    Course.find({_id : { "$in": wistlist }}).exec((err, course) => {
        if (err) {
            console.log(err)
        }            
        res.render('user/learning/wistlist', {
            courses: course 
        })
    })
}


exports.renderArchived = (req, res) => {
    res.render('user/learning/archived', {
        user: res.locals.user
    });
}