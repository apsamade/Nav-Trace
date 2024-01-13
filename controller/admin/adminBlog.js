const Article = require('../../models/article')

exports.getBlogAdmin = async (req, res, next)=>{
    const user = req.session.user
    const articles = await Article.find()
    if(user && user.admin){
        res.render('admin/blogAdmin', { user, articles })
    }else{
        res.redirect('/')
    }
}

exports.postBlogAdmin = (req, res, next)=>{

}