const User = require('../model/User')
const Course = require('../model/Course')
const _ = require('lodash');
const { stubArray } = require('lodash');

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

exports.renderAllCourses =  (req, res) => {
    var courseNum;
    var studentClass = [];
    var myCourse = [];
    Course.find().exec((err, courses) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        courseNum = courses.length
        for(var i=0;i<courseNum;i++)
        {
           var studentlength = courses[i].students.length;
           var studentArray = [];
           for(var j = 0; j<studentlength;j++)
           {
               studentArray[j] = courses[i].students[j].student;
           }
           studentClass[i] = studentArray;
        }
        var index = 0;
        for(var k = 0;k<courseNum;k++)
        {
            User.find({$and: [{_id : { "$in": studentClass[k] }}, {_id : res.locals.user._id}]}).exec((err, user) => {
                
                if (err) {
                    console.log(err)
                } 
                else{
                    console.log(index);
                     
                    if(user.length>0)
                    {
                        console.log(index);
                        myCourse[i] = courses[i]
                    
                    }  
                }
                index++;

            })
        }
    })
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