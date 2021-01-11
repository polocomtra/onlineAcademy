const express = require('express');
const { signup } = require('../controller/auth');
const router = express.Router();

const { renderProfile, coursesByUser, updateProfile, isAdmin, getAllCoursesByAdmin,
    getAllCategoriesByAdmin, getAllUsersByAdmin, renderDeleteUserForm, renderUpdateUserForm,
    updateUser, deleteUser, renderAddCategoryForm, addCategory, renderUpdateCategoryForm, updateCategory,
    renderDeleteCategoryForm, deleteCategory, findCourseExist, renderDeleteCourseForm, deleteCourse } = require('../controller/user');
const { layoutMiddleWare } = require('../middlewares/layout');
const { renderAllCourses } = require('../controller/user');
const { renderCollection } = require('../controller/user');
const { renderWistlist } = require('../controller/user');
const { renderArchived } = require('../controller/user');



router.get('/profile/:userId', layoutMiddleWare, renderProfile)

router.post('/profile/:userId', updateProfile)
router.get('/courses/:userId', coursesByUser)
//lists all 
router.get('/admin/courses', isAdmin, getAllCoursesByAdmin)
router.get('/admin/categories', isAdmin, getAllCategoriesByAdmin)
router.get('/admin/users', isAdmin, getAllUsersByAdmin)
//user management (update + delete)
router.get('/admin/updateUser/:userId', renderUpdateUserForm)
router.get('/admin/deleteUser/:userId', renderDeleteUserForm)
router.post('/admin/updateUser/:userId', updateUser)
router.post('/admin/deleteUser/:userId', deleteUser)
//category management (add+update+delete)
router.get('/admin/addCategory', renderAddCategoryForm)
router.post('/admin/addCategory', addCategory)
router.get('/admin/updateCategory/:categoryId', renderUpdateCategoryForm)
router.post('/admin/updateCategory/:categoryId', updateCategory);
router.get('/admin/deleteCategory/:categoryId', renderDeleteCategoryForm)
router.post('/admin/deleteCategory/:categoryId', findCourseExist, deleteCategory);
//course category (delete)
router.get('/admin/deleteCourse/:courseId', renderDeleteCourseForm)
router.post('/admin/deleteCourse/:courseId', deleteCourse)


router.get('/learning/all-courses', layoutMiddleWare, renderAllCourses)
router.get('/learning/collection', layoutMiddleWare, renderCollection)
router.get('/learning/wistlist', layoutMiddleWare, renderWistlist)
router.get('/learning/archived', layoutMiddleWare, renderArchived)

module.exports = router;