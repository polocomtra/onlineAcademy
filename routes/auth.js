const express = require('express');
const router = express.Router();
const Category = require('../model/Category');

const { signup, signin, signout, getSignupForm, getSigninForm } = require('../controller/auth')
const { userSignupValidator } = require('../validator/index')

Category.find()

Category.find({},function(err,categories){
    if(err) console.warn(err);
    console.warn(categories);
    data = categories;
})
router.get('/', (req, res) => {
    res.render('test', {records: data})
})
router.get('/signup', getSignupForm);
router.post('/signup', userSignupValidator, signup);
router.get('/signin', getSigninForm)
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;