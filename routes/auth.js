const express = require('express');
const router = express.Router();

const { signup, signin, signout } = require('../controller/auth')
const { userSignupValidator } = require('../validator/index')

router.get('/',(req,res)=>{
    res.render('test')
})
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;