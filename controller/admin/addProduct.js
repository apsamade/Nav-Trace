const Article = require('../../models/article')
const fs = require('fs')
const imgbbUploader = require('imgbb-uploader');
const path = require('path')

exports.getAddProduct = async (req, res, next) => {
    const user = req.session.user
    if (user && user.admin) {
        res.render('admin/addProduct', { user })
    } else {
        res.redirect('/')
    }
}

exports.postAddProduct = async (req, res, next) => {
    const user = req.session.user
}