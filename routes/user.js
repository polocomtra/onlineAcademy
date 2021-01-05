const express = require('express');
const router = express.Router();

const { renderProfile, coursesByUser, updateProfile } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');



router.get('/profile/:userId', layoutMiddleWare, renderProfile)
router.post('/profile/:userId', layoutMiddleWare, updateProfile)
router.get('/courses/:userId', coursesByUser)

module.exports = router;