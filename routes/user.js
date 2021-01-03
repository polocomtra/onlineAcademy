const express = require('express');
const router = express.Router();

const { renderProfile } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');

router.get('/profile/:userId', layoutMiddleWare, renderProfile)

module.exports = router;