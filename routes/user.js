const express = require('express');
const { signup } = require('../controller/auth');
const router = express.Router();

const { renderProfile, coursesByUser, updateProfile, isAdmin, getAllCoursesByAdmin,
    getAllCategoriesByAdmin, getAllUsersByAdmin, renderDeleteUserForm, renderUpdateUserForm,
    updateUser, deleteUser, renderAddCategoryForm, addCategory } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');



router.get('/profile/:userId', layoutMiddleWare, renderProfile)
router.post('/profile/:userId', updateProfile)
router.get('/courses/:userId', coursesByUser)
router.get('/admin/courses', getAllCoursesByAdmin)
router.get('/admin/categories', getAllCategoriesByAdmin)
router.get('/admin/users', getAllUsersByAdmin)
router.get('/admin/addCategory', layoutMiddleWare, renderAddCategoryForm)
router.post('/admin/addCategory', addCategory)
router.get('/admin/updateUser/:userId', layoutMiddleWare, renderUpdateUserForm)
router.get('/admin/deleteUser/:userId', layoutMiddleWare, renderDeleteUserForm)
router.post('/admin/updateUser/:userId', updateUser)
router.post('/admin/deleteUser/:userId', deleteUser)


module.exports = router;