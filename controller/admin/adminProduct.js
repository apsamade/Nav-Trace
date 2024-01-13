const Article = require('../../models/article')

exports.getProductAdmin = async (req, res, next)=>{
    const user = req.session.user
    const articles = await Article.find()
    if(user && user.admin){
        res.render('admin/boutiqueAdmin', { user, articles })
    }else{
        res.redirect('/')
    }
}

exports.postProductAdmin = (req, res, next)=>{

}