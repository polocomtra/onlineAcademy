const Category = require('../model/Category')
const Field = require('../model/Field')


exports.renderLayout = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            console.log(err)
        }
        res.render('test', {
            categories: categories,
        })
    })
}

exports.layoutMiddleWare=(req,res,next)=>{

    // Category.find().exec((err, categories) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     // res.render('test', {
    //     //     categories: categories
    //     // })
    //     req.categories=categories;
    // })

    //Send data with alphabet sort

    Category.find({}, null, {sort: {name: 1}}, function (err, categories) {
        console.log(categories)
        req.categories=categories;
    });


    Field.find().exec((err, fields) => {
        if (err) {
            console.log(err)
        }
        req.fields = fields;
    })
    next()
}