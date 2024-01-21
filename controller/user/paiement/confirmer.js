const Panier = require('../../../models/panier')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getConfirmation = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    const sessionId = req.query.session_id
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session)
    if(panier){
        if(user && session.payment_status === 'paid' && session.consent.terms_of_service == 'accepted'){$

            delete panier
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