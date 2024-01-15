const Product = require('../../../models/product')

exports.getProduct = async (req, res, next)=>{
    const user = req.session.user
    const productId = req.params.id
    const produit = await Product.findById(productId)
    res.render('boutique/product', { user, produit })
}

exports.postProduct = (req, res, next)=>{

}