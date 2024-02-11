const Panier = require('../../../models/panier')
const Product = require('../../../models/product')
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
    const produits = await Product.find()
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

            // Créez un array contenant uniquement les IDs des produits dans le panier
            const productIds = thisPanier.products.map(produitPanier => produitPanier._id.toString());

            // Filtrer les produits pour inclure uniquement ceux dont l'ID est dans le panier
            const produitsDansPanier = produits.filter(produit => productIds.map(productId => productId.toString() == produit._id.toString()));

            // Créez un array contenant les noms de tous les produits dans le panier
            const nomsProduitsDansPanier = produitsDansPanier.map(produit => produit.name);

            console.log('liste des produits : ', nomsProduitsDansPanier)
            // Créez le produit pour le panier
            const productAbonnement = await stripe.products.create({
                name: "Abonnement Nav Trace",
                type: 'service', // Indiquez qu'il s'agit d'un service abonnement
            });
            // Créez le produit pour l'abonnement
            const productPanier = await stripe.products.create({
                name: "Panier Nav Trace",
                features: nomsProduitsDansPanier.map(nom => ({ name: nom })),
            });


            // Créez le prix pour le panier
            const pricePanier = await stripe.prices.create({
                product: productPanier.id,
                currency: 'eur',
                unit_amount: thisPanier.prix_total, // Montant total du panier en centimes (par exemple 9.99€)
            });
            // Créez le prix de l'abonnement
            const priceAbonnement = await stripe.prices.create({
                product: productAbonnement.id,
                currency: 'eur',
                unit_amount: 999, // Montant mensuel de l'abonnement en centimes (par exemple 70€)
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
                        quantity: thisPanier.quantite_total,
                    },
                ],
                consent_collection: {
                    terms_of_service: 'required',
                },
                shipping_address_collection: {
                    allowed_countries: ['FR'],
                },
                custom_text: {
                    terms_of_service_acceptance: {
                        message: 'Je suis d\'accord avec les [Conditions d\'utilisation](https://nav-trace.onrender.com/cgv)',
                    },
                    shipping_address: {
                        message: 'La livraison en 2 jours n\'est actuellement pas assurée pour les boîtes postales.',
                    },
                },
                phone_number_collection: {
                    enabled: true,
                },
                metadata: {
                    user_id: thisPanier.user_id.toString(),
                    panier_id: thisPanier._id.toString()
                },
                mode: 'subscription', // Indiquez que c'est une session d'abonnement
                return_url: `${YOUR_DOMAIN}/panier/${panierId}/paiement/confirmer?session_id={CHECKOUT_SESSION_ID}`,
            });

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
