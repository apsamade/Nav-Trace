const Product = require('../../../models/product')

exports.getModifProduct = async (req, res, next)=>{
    const user = req.session.user
    const productId = req.params.id
    const produit = await Product.findById(productId)
    if(user && user.admin){
        res.render('admin/product/modifProduct', { user, produit })
    }else{
        res.redirect('/')
    }
}

exports.postModifProduct = (req, res, next)=>{

}