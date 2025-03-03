exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();
    req.check('email', 'Email must between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 3,
            max: 32
        });
    req.check('password', "Password is required").notEmpty()
    req.check('password')
        .isLength({
            min: 6
        })
        .matches(/\d/)
        .withMessage('Password must at least 6 characters and has 1 digit')
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.render('auth/signup', {
            layout: 'auth/signup',
            error: true,
            signup: false,
            errorMessage: firstError
        })
    }
    next()
}