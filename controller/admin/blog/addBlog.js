const Article = require('../../../models/article')
const fs = require('fs')
const imgbbUploader = require('imgbb-uploader');
const path = require('path')

exports.getAddBlog = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    if (user && user.admin) {
        res.render('admin/blog/addBlog', { user, panier })
    } else {
        res.redirect('/')
    }
}

exports.postAddBlog = async (req, res, next) => {
    const user = req.session.user
}