exports.getBlog = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    res.render('blog/blog', { user, panier })
}

exports.postBlog = (req, res, next)=>{

}