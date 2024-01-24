const User = require('../../../models/user')
const Panier = require('../../../models/panier')
const bcrypt = require('bcrypt')

exports.getConnexion = (req, res, next)=>{
    const panier = req.session.panier
    const user = req.session.user
    res.render('login/connexion', {panier, user})
}

exports.postConnexion = async (req, res, next)=>{
    const {email, mdp} = req.body
    const panier = req.session.panier
    const userExisting = await User.findOne({email: email})
    try {
        if(userExisting && bcrypt.compareSync(mdp, userExisting.mdp)){
            const monPanier = await Panier.findOne({user_id: userExisting._id, payer: false})
            if(panier && !panier.payer){
                req.session.panier = panier;
                panier.user_id = userExisting._id;
                await Panier.findByIdAndUpdate(panier._id, {
                    $set: {
                        user_id: userExisting._id
                    }
                })
            }else if(monPanier){
                req.session.panier = monPanier                
            }
            req.session.user = userExisting

            console.log(req.session.user)
            res.redirect('/')
        }else{
            if(!userExisting){
                const user = req.session.user
                return res.render('login/connexion', {error : 'Adresse Email non trouvée.', panier, user})
            }
            if(!bcrypt.compareSync(mdp, userExisting.mdp)){
                const user = req.session.user
                return res.render('login/connexion', {error : 'Mot de passe inccorect.', panier, user})
            }
        }
    } catch (error) {
        console.log(error)
        res.render('login/connexion')
    }
}