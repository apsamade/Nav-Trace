const Product = require('../../../models/product')
const Panier = require('../../../models/panier')

exports.getPanier = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const produits = await Product.find()
    res.render('compte/panier', { user, panier, produits })

}

exports.postPanier = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const { panierProductId, inscription } = req.body
    const produits = await Product.find()

    let panierFiltrer = panier.products.filter(product => product._id !== panierProductId);
    let newQuantiteTotal = 0;
    let newPrixTotal = 0;
    panierFiltrer.map(product => {
        if (!isNaN(product.quantite)) {
            newQuantiteTotal += parseInt(product.quantite);
        }
    });
    panierFiltrer.map(product => {
        if (!isNaN(product.prix)) {
            newPrixTotal += parseInt(product.prix);
        }
    });
    console.log('nouvel quantite : ', newQuantiteTotal)
    console.log('nouveau prix : ', newPrixTotal)
    await Panier.findByIdAndUpdate(panier._id, {
        $set: {
            products: panierFiltrer,
            quantite_total: newQuantiteTotal,
            prix_total: newPrixTotal
        }
    })
    const newPanier = await Panier.findById(panier._id)
    panier.products = panierFiltrer;
    panier.quantite_total = newPanier.quantite_total;
    panier.prix_total = newPanier.prix_total;
    console.log('mon panier : ', panierFiltrer)

    // renvoie vers inscription avec cookie pour rediriger vers le paiement

    res.render('compte/panier', { user, panier, produits })
}