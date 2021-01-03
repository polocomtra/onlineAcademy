exports.renderProfile = (req, res) => {
    res.render('user/profile', {
        user: res.locals.user,
        fields: res.locals.fields
    });
}

exports.isPro = (req, res, next) => {
    if (res.locals.user.role == 2 || res.locals.user.role == 3) {
        next();
    } else {
        return res.status(400).json({
            error: "You are not authorized"
        })
    }
}