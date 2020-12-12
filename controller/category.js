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

// exports.getFieldNameMdw=(req,res,next)=>{
//     const fieldName=req.params.fieldName;
//     Field.findOne({name:fieldName}).exec((err,field)=>{
//         if(err){
//             return res.status(400).json({
//                 error:err
//             })
//         }
//         req.field=field;
//         next();
//     })
// }

// exports.getCategoryNameMdw=(req,res,next)=>{
//     const categoryName=req.params.categoryName;
//     Category.findOne({name:categoryName}).exec((err,category)=>{
//         if(err){
//             return res.status(400).json({
//                 error:err
//             })
//         }
//         req.category=category;
//         next();
//     })
// }