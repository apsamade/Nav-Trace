const Article = require('../../../models/article')

exports.getBlogAdmin = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const articles = await Article.find()
    if(user && user.admin){
        res.render('admin/blog/blogAdmin', { user, articles, panier })
    }else{
        res.redirect('/')
    }
}

exports.postBlogAdmin = (req, res, next)=>{

}