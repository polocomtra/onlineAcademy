const express = require('express');
const router = express.Router();

const { createCategory } = require('../controller/category')

router.post('/create', createCategory);


module.exports = router;