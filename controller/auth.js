const User = require('../model/User')
const { errorHandler } = require('../helpers/errorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(404).json({
                error: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({ user })
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email doesn't exist. Please sign in"
            })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password donot match"
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token);
        const { _id, name, email, role } = user;
        return res.json({
            token: token,
            user: {
                _id, name, email, role
            }
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({
        message: "Signout successfully"
    })
}