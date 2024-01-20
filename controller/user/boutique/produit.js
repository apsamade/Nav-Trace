const Product = require('../../../models/product')
const Panier = require('../../../models/panier')

exports.getProduct = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const productId = req.params.id
    const produit = await Product.findById(productId)
    res.render('boutique/product', { user, produit, panier })
}

exports.postProduct = async (req, res, next) => {
    const user = req.session.user
    const { quantite, achatDirect } = req.body
    console.log(quantite)
    const productId = req.params.id
    const produit = await Product.findById(productId)
    try {
        if (req.session.panier && !req.session.panier.payer && !achatDirect) {
            const panier = req.session.panier
            let totalQuantite = panier.quantite_total + parseInt(quantite);
            let totalPrix = panier.prix_total + produit.prix_achat * parseInt(quantite)
            let prixProduit = produit.prix_achat * parseInt(quantite)
            console.log('quantite total actuelle ', totalQuantite)
            console.log('prix total actuelle ', totalPrix)
            await Panier.findByIdAndUpdate(panier._id, {
                $addToSet: {
                    products:{
                        product_id: productId,
                        quantite: quantite,
                        prix: prixProduit
                    }
                },
                $set: {
                    quantite_total: totalQuantite,
                    prix_total: totalPrix
                }
            })
            if (user) { 
                await Panier.findByIdAndUpdate(panier._id, {
                    $set: {
                        user_id: user._id 
                    }
                })
            }
            let newPanier = await Panier.findById(panier._id);
            panier.products = newPanier.products;
            panier.quantite_total = newPanier.quantite_total;
            panier.prix_total = newPanier.prix_total;
            if (user && panier.user_id != 'undefined') { panier.user_id = user._id }
            console.log('session shopping continue : ', req.session.panier)
            console.log('prix du panier : ', panier.prix_total/100, '€')
            res.render('boutique/product', { user, produit, panier, message: 'Produit ajouté à votre panier !' })
        } else if(!req.session.panier && !achatDirect) {
            let prixProduit = produit.prix_achat * parseInt(quantite)
            const panier = new Panier({
                products: [],
                prix_total: produit.prix_achat * quantite,
                quantite_total: quantite,
            })
            panier.products.push({
                product_id: productId,
                quantite: quantite,
                prix: prixProduit
            });
            if (user) { panier.user_id = user._id }
            await panier.save()
            req.session.panier = panier;
            console.log('session shopping ouverte : ', req.session.panier)
            res.render('boutique/product', { user, produit, panier })
        } else if(achatDirect) {
            let prixProduit = produit.prix_achat * parseInt(quantite)
            const panier = new Panier({
                products: [],
                prix_total: produit.prix_achat * quantite,
                quantite_total: quantite,
            })
            panier.products.push({
                product_id: productId,
                quantite: quantite,
                prix: prixProduit
            });
            if (user) { panier.user_id = user._id }
            await panier.save()
            req.session.panier = panier;
            console.log('session shopping ouverte : ', req.session.panier)
            if(user){
                res.redirect(`/panier/${panier._id}/paiement`)                
            }else{
                res.redirect(`/inscription?passer_commande=true`)       
            }
        }

    } catch (error) {
        const panier = req.session.panier
        res.render('boutique/product', { user, produit, panier })
        console.log(error)
    }
}
