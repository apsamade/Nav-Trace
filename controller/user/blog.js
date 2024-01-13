exports.getBlog = async (req, res, next)=>{
    const user = req.session.user
    res.render('blog/blog', { user })
}

exports.postBlog = (req, res, next)=>{

}