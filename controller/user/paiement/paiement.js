const Panier = require('../../../models/panier')
const Product = require('../../../models/product')
const YOUR_DOMAIN = process.env.YOUR_DOMAIN
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPayement = async (req, res, next) => {
    const user = req.session.user;
    const panier = req.session.panier;
    const panierId = req.params.id
    const thisPanier = await Panier.findById(panierId)
    if (user && thisPanier.user_id == user._id.toString()) {
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

            // Créez le produit pour le panier
            const productAbonnement = await stripe.products.create({
                name: "Abonnement Nav Trace",
                type: 'service', // Indiquez qu'il s'agit d'un service abonnement
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
            let lineItems = [];

            thisPanier.products.forEach(prod => {
                let thisName = '';
                let thisImage = '';
                produits.map(produit =>{
                    if(prod.product_id.toString() == produit._id){
                        thisName = produit.name;
                        thisImage = produit.image;
                    }
                })
                
                lineItems.push({
                    "price_data": {
                        "unit_amount": (prod.prix).toString(), // Convertir le prix en centimes
                        "currency": "eur",
                        "product_data": {
                            "name": thisName.toString(), // Assurez-vous que prod.nom est une chaîne de caractères
                            "images": [thisImage] // Supposons que prod.image contient l'URL de l'image du produit
                        }
                    },
                    "quantity": prod.quantite.toString() // Convertir la quantité en chaîne de caractères
                });
            });
            
            console.log('line item que j\'ai créer', ...lineItems)

            // Créez une session de paiement pour que l'utilisateur puisse payer le panier et s'abonner en même temps
            const session = await stripe.checkout.sessions.create({
                customer: customer.id,
                ui_mode: 'embedded',
                payment_method_types: ['card'],
                line_items: [
                    ...lineItems,
                    {
                        price: priceAbonnement.id,
                        quantity: thisPanier.quantite_total,
                    },
                ],
                consent_collection: {
                    terms_of_service: 'required',
                },
                automatic_tax: { 
                    enabled: true, 
                    liability: null, 
                    status: null 
                },
                shipping_address_collection: {
                    allowed_countries: ['FR'],
                },
                billing_address_collection: 'auto',
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
