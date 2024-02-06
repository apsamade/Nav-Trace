const Panier = require('../../../models/panier')
const YOUR_DOMAIN = process.env.YOUR_DOMAIN
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPayement = async (req, res, next) => {
    const user = req.session.user;
    const panier = req.session.panier;
    const panierId = req.params.id
    const thisPanier = await Panier.findById(panierId)
    if (user) {
        res.render('paiement/paiement', { user, thisPanier, panier })
    } else {
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
            // Créez le client Stripe
            const customer = await stripe.customers.create({
                email: user.email,
            });

            // Créez le produit pour le panier
            const productPanier = await stripe.products.create({
                name: "Panier Nav Trace",
            });

            // Créez le prix pour le panier
            const pricePanier = await stripe.prices.create({
                product: productPanier.id,
                currency: 'eur',
                unit_amount: 999, // Montant total du panier en centimes (par exemple 9.99€)
            });

            // Créez le produit pour l'abonnement
            const productAbonnement = await stripe.products.create({
                name: "Abonnement Nav Trace",
                type: 'service', // Indiquez qu'il s'agit d'un service abonnement
            });

            // Créez le prix de l'abonnement
            const priceAbonnement = await stripe.prices.create({
                product: productAbonnement.id,
                currency: 'eur',
                unit_amount: thisPanier.prix_total, // Montant mensuel de l'abonnement en centimes (par exemple 70€)
                recurring: {
                    interval: 'month',
                }
            });

            // Créez une session de paiement pour que l'utilisateur puisse payer le panier et s'abonner en même temps
            const session = await stripe.checkout.sessions.create({
                customer: customer.id,
                ui_mode: 'embedded',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: pricePanier.id,
                        quantity: 1,
                    },
                    {
                        price: priceAbonnement.id,
                        quantity: 1,
                    },
                ],
                consent_collection: {
                    terms_of_service: 'required',
                },
                custom_text: {
                    terms_of_service_acceptance: {
                        message: 'Je suis d\'accord avec les [Conditions d\'utilisation](https://ml-prestige.com/test-drive/politique)',
                    }
                },
                mode: 'subscription', // Indiquez que c'est une session d'abonnement
                return_url: `${YOUR_DOMAIN}/panier/${panierId}/paiement/confirmer?session_id={CHECKOUT_SESSION_ID}`,            });

            // Renvoyez l'URL de la session de paiement au client pour redirection
            res.send({ clientSecret: session.client_secret });
        } catch (error) {
            // En cas d'erreur, renvoyer une réponse d'erreur au client
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la création de la session de paiement." });
        }
    }
    // impossible de faire un paiement reccurent avec payment intent
    // tenter un stripe.prices à prix unique + stripe.plans pour créer un paiement reccurent avec subscription
    // invoiceItem ??

};
