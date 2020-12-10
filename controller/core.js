const Category = require('../model/Category')


exports.renderLayout = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            console.log(err)
        }
        res.render('test', {
            categories: categories
        })
    })
}

exports.layoutMiddleWare=(req,res,next)=>{
    Category.find().exec((err, categories) => {
        if (err) {
            console.log(err)
        }
        // res.render('test', {
        //     categories: categories
        // })
        req.categories=categories;
    })
    next()
}