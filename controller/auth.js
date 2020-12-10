const User = require('../model/User')
const { errorHandler } = require('../helpers/errorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.render('data/signup', {
                error: true,
                signup: false,
                errorMessage: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.render('auth/signup', {
            layout: 'auth/signup',
            signup: true,
            error: false,
            successMessage: "Sign up successfully"
        })
    })
}



exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.render('auth/signin', {
                layout: 'auth/signin',
                error: true,
                errorMessage: "User with that email doesn't exist. Please sign up"
            })
        }
        if (!user.authenticate(password)) {
            return res.render('auth/signin', {
                layout: 'auth/signin',
                error: true,
                errorMessage: "Email and password do not match. Please try again"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token);
        const { _id, name, email, role } = user;
        return res.render('test')
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: "Signout successfully"
    })
}

exports.getSignupForm = (req, res) => {
    res.render('auth/signup', {
        layout: 'auth/signup',
        signup: false,
        error: false
    }
    )
}

exports.getSigninForm = (req, res) => {
    res.render('auth/signin', {
        layout: 'auth/signin',
        error: false
    })
}