const express = require('express')
const router = express.Router()

const adminController = require('../controller/admin/admin')

const addBlogController = require('../controller/admin/addBlog')
const blogAdminController = require('../controller/admin/adminBlog')

router.get('/admin', adminController.getAdmin)
router.post('/admin', adminController.postAdmin)

router.get('/admin/blog', blogAdminController.getBlogAdmin)
router.post('/admin/blog', blogAdminController.postBlogAdmin)

router.get('/admin/blog/add', addBlogController.getAddBlog)
router.post('/admin/blog/add', addBlogController.postAddBlog)

module.exports = router