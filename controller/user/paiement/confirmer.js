const Panier = require('../../../models/panier')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getConfirmation = async (req, res, next) => {
    const user = req.session.user
    const paymentId = req.query.payment_intent
    
    if (user) {
        delete req.session.panier
        res.render('paiement/confirmer', { user })
    } else if (user) {
        const panier = req.session.panier
        res.render('paiement/confirmer', { user, panier, erreur: "Panier non payé !" })
    } else {
        res.redirect('/connexion')
    }

}

exports.postConfirmation = (req, res, next) => {


}