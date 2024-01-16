const Product = require('../../../models/product')

exports.getProductAdmin = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const produits = await Product.find()
    if(user && user.admin){
        res.render('admin/product/boutiqueAdmin', { user, produits, panier })
    }else{
        res.redirect('/')
    }
}

exports.postProductAdmin = (req, res, next)=>{

}