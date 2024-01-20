const Panier = require('../../../models/panier')

exports.getConfirmation = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    if(panier){
        const thisPanier = await Panier.findById(panier._id)
        if(user && thisPanier.payer){
            res.render('paiement/confirmer', { user, panier })
        }else if(user && !thisPanier.payer){
            res.render('paiement/confirmer', { user, panier, erreur : "Panier non payé !" })
        }else{
            res.redirect('/connexion')
        }        
    }

}

exports.postConfirmation = (req, res, next)=>{


}