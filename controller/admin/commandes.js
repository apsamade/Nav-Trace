const Panier = require('../../models/panier')
const Product = require('../../models/product')

exports.getCommandes = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const paniers = await Panier.find({payer: true})
    const produits = await Product.find()

    if(user && user.admin){
        res.render('admin/commandes', { user, panier, paniers, produits })
    }else{
        res.redirect('/')
    }
}

exports.postCommandes = (req, res, next)=>{

}