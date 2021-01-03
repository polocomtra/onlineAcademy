const Category = require('../model/Category')
const Field = require('../model/Field')


exports.layoutMiddleWare = async (req, res, next) => {
    //Send data with alphabet sort
    await Category.find({}, null, { sort: { name: 1 } }, function (err, categories) {
        res.locals.categories = categories;
    });
    await Field.find().exec((err, fields) => {
        res.locals.fields = fields;
    })
    if (typeof (req.session.isAuth) === 'undefined') {
        req.session.isAuth = false;
    }
    if (typeof (req.session.user) === 'undefined') {
        req.session.user = false;
    }
    res.locals.user = req.session.user;
    res.locals.isAuth = req.session.isAuth;
    res.locals.user = req.session.user;
    next()
}
