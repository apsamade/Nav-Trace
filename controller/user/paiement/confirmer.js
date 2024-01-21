const Panier = require('../../../models/panier')

exports.getConfirmation = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const thisPanier = await Panier.findById(panier._id)
    const session = await stripe.checkout.sessions.retrieve(panier.paiement_stripe_id);
    console.log(session)
    if(panier){
        if(user && session.payment_status === 'paid' && session.consent.terms_of_service == 'accepted'){
            res.render('paiement/confirmer', { user, panier })
        }else if(user && session.payment_status != 'paid'){
            res.render('paiement/confirmer', { user, panier, erreur : "Panier non payé !" })
        }else{
            res.redirect('/connexion')
        }        
    }

}

exports.postConfirmation = (req, res, next)=>{


}