const express = require('express')
const router = express.Router()

const adminController = require('../controller/admin/admin')

const addBlogController = require('../controller/admin/blog/addBlog')
const blogAdminController = require('../controller/admin/blog/adminBlog')

const addProductController = require('../controller/admin/product/addProduct')
const boutiqueAdminController = require('../controller/admin/product/adminProduct')

router.get('/admin', adminController.getAdmin)
router.post('/admin', adminController.postAdmin)

router.get('/admin/blog', blogAdminController.getBlogAdmin)
router.post('/admin/blog', blogAdminController.postBlogAdmin)

router.get('/admin/blog/add', addBlogController.getAddBlog)
router.post('/admin/blog/add', addBlogController.postAddBlog)

router.get('/admin/boutique', boutiqueAdminController.getProductAdmin)
router.post('/admin/boutique', boutiqueAdminController.postProductAdmin)

router.get('/admin/boutique/add-product', addProductController.getAddProduct)
router.post('/admin/boutique/add-product', addProductController.postAddProduct)



module.exports = router