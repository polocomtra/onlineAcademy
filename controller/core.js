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
    //Send data with alphabet sort
    Category.find({}, null, {sort: {name: 1}}, function (err, categories) {
        res.locals.categories=categories;
    });
    Field.find().exec((err, fields) => {
        res.locals.fields = fields;
    })
    next()
}

