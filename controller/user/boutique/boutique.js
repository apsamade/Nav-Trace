const Product = require('../../../models/product')

exports.getBoutique = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const produits = await Product.find()
    res.render('boutique/boutique', { user, produits, panier })
}

exports.postBoutique = (req, res, next)=>{

}