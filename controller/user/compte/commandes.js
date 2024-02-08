const Panier = require('../../../models/panier')
const Product = require('../../../models/product')

exports.getCommandes = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier

    if(user){
        const paniers = await Panier.find({payer: true, user_id: user._id})
        const produits = await Product.find()
        res.render('compte/commandes', { user, panier, paniers, produits })
    }else{
        res.redirect('/')
    }
}

exports.postCommandes = (req, res, next)=>{

}