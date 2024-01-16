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
    const { quantite } = req.body
    console.log(quantite)
    const productId = req.params.id
    const produit = await Product.findById(productId)
    try {
        if (req.session.panier) {
            const panier = req.session.panier
            let totalQuantite = panier.quantite_total + parseInt(quantite);
            let totalPrix = panier.prix + produit.prix_achat * quantite
            console.log('quantite total actuelle ', totalQuantite)
            await Panier.findByIdAndUpdate(panier._id, {
                $addToSet: {
                    products:{
                        product_id: productId,
                        quantite: quantite
                    }
                },
                $set: {
                    quantite_total: totalQuantite,
                    prix: totalPrix
                }
            })
            if (user) { 
                await Panier.findByIdAndUpdate(panier._id, {
                    $set: {
                        user_id: user._id 
                    }
                })
            }
            panier.products.push({
                product_id: productId,
                quantite: quantite,
            });
            panier.quantite_total = totalQuantite;
            panier.prix = totalPrix;
            if (user && panier.user_id != 'undefined') { panier.user_id = user._id }
            console.log('session shopping continue : ', req.session.panier)
            console.log('prix du panier : ', panier.prix/100, '€')
            res.render('boutique/product', { user, produit, panier })
        } else {
            const panier = new Panier({
                products: [],
                prix: produit.prix_achat * quantite,
                quantite_total: quantite
            })
            panier.products.push({
                product_id: productId,
                quantite: quantite,
            });
            if (user) { panier.user_id = user._id }
            await panier.save()
            req.session.panier = panier;
            console.log('session shopping ouverte : ', req.session.panier)
            res.render('boutique/product', { user, produit, panier })
        }

    } catch (error) {
        const panier = req.session.panier
        res.render('boutique/product', { user, produit, panier })
        console.log(error)
    }
}

// implementer une logique qui dis que si un panier est deja existant alors ca modifie sinon ca créer
// if (req.session.panier){ok on modifie}else{on créer}
// possibilité de stocker les panier sous cookie ? a verifier 
