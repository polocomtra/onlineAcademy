const express = require('express');
const router = express.Router();

const { signup, signin, signout, getSignupForm, getSigninForm } = require('../controller/auth')
const { userSignupValidator } = require('../validator/index')


router.get('/signup', getSignupForm);
router.post('/signup', userSignupValidator, signup);
router.get('/signin', getSigninForm)
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;