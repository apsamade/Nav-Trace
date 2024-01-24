const Panier = require('../../../models/panier')

exports.getFacture = async (req, res, next) => {
    const user = req.session.user
    const panierId = req.params.id
    const panier = await Panier.findById(panierId)
    console.log(user._id)
    console.log(panier.user_id)
    console.log(panier.user_id.equals(user._id))

    if(panier.user_id.equals(user._id) || user.admin){
        try {
            res.setHeader('Content-Type', panier.facture.contentType);
            res.send(panier.facture.data);
        } catch (err) {
            console.log(err)
        }        
    }else{
        console.log('utilisateur non autorisé a regarder cette facture')
        res.redirect(`/connexion`)
    }

}