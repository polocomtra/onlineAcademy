const Category = require('../model/Category');
const Field = require('../model/Field');
const { errorHandler } = require('../helpers/errorHandler');
const User = require('../model/User');

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    console.log(category);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            category
        })
    })
}