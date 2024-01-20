const Panier = require('../../../models/panier')
const YOUR_DOMAIN = process.env.YOUR_DOMAIN
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPayement = async (req, res, next) => {
    const user = req.session.user;
    const panier = req.session.panier;
    const panierId = req.params.id
    const thisPanier = await Panier.findById(panierId)
    if(user){
        res.render('paiement/paiement', { user, thisPanier })
    }else{
        res.redirect('/connexion')
    }

}
exports.postPayement = async (req, res, next) => {
    // payement
    const user = req.session.user;
    const panier = req.session.panier;
    const panierId = req.params.id
    const thisPanier = await Panier.findById(panierId)
    console.log('this panier : ', thisPanier)
    console.log('panier session : ', panier)
    if (thisPanier.payer) {
        res.json({ alreadyPaid: thisPanier.payer });
        console.log('panier payer !')
    } else {
        try {
            const product = await stripe.products.create({
                name: `Panier Nav Trace`,
            });
            const price = await stripe.prices.create({
                product: product.id,
                unit_amount: (thisPanier.prix_total),
                currency: 'eur',
            })
            const session = await stripe.checkout.sessions.create({
                ui_mode: 'embedded',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: price.id,
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                return_url: `${YOUR_DOMAIN}/panier/${panierId}/paiement/confirmer?session_id={CHECKOUT_SESSION_ID}`,
                metadata: {
                    // meta data pour completer l'user complet
                    // email / tel / adresse etc ...
                    user_id: thisPanier.user_id.toString(),
                    panier_id: thisPanier._id.toString()
                },
                consent_collection: {
                    terms_of_service: 'required',
                },
                shipping_address_collection: {
                    allowed_countries: ['FR'],
                },
                custom_text: {
                    terms_of_service_acceptance: {
                        message: `Je suis d\'accord avec les [Conditions d\'utilisation](${YOUR_DOMAIN}/politique)`,
                    },
                    shipping_address: {
                        message: 'La livraison en 2 jours n\'est actuellement pas assurée pour les boîtes postales.',
                    },
                },
            });
            res.send({ clientSecret: session.client_secret });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la création de l'intention de paiement." });
        }
    }

};
