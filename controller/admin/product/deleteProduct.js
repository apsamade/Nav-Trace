const Product = require('../../../models/product')

exports.getDeleteProduct = async (req, res, next)=>{
    const user = req.session.user
    const productId = req.params.id
    const produit = await Product.findById(productId)
    if(user && user.admin){
        res.render('admin/product/deleteProduct', { user, produit })
    }else{
        res.redirect('/')
    }
}

exports.postDeleteProduct = (req, res, next)=>{

}