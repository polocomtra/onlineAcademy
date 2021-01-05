const express = require('express');
const router = express.Router();

const { renderProfile } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');
const { renderAllCourses } = require('../controller/user');
const { renderCollection } = require('../controller/user');
const { renderWistlist } = require('../controller/user');
const { renderArchived } = require('../controller/user');

router.get('/profile/:userId', layoutMiddleWare, renderProfile)
router.get('/learning/all-courses', layoutMiddleWare, renderAllCourses)
router.get('/learning/collection', layoutMiddleWare, renderCollection)
router.get('/learning/wistlist', layoutMiddleWare, renderWistlist)
router.get('/learning/archived', layoutMiddleWare, renderArchived)
module.exports = router;