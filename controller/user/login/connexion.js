const User = require('../../../models/user')
const Panier = require('../../../models/panier')
const bcrypt = require('bcrypt')

exports.getConnexion = (req, res, next)=>{
    res.render('login/connexion')
}

exports.postConnexion = async (req, res, next)=>{
    const {email, mdp} = req.body
    const panier = req.session.panier
    const userExisting = await User.findOne({email: email})
    try {
        if(userExisting && bcrypt.compareSync(mdp, userExisting.mdp)){
            const monPanier = await Panier.findOne({user_id: userExisting._id})
            if(monPanier){
                req.session.panier = monPanier                
            }else if(panier){
                req.session.panier = panier
            }
            req.session.user = userExisting

            console.log(req.session.user)
            res.redirect('/')
        }else{
            if(!userExisting){
                return res.render('login/connexion', {error : 'Adresse Email non trouvée.', panier})
            }
            if(!bcrypt.compareSync(mdp, userExisting.mdp)){
                return res.render('login/connexion', {error : 'Mot de passe inccorect.', panier})
            }
        }
    } catch (error) {
        console.log(error)
        res.render('login/connexion')
    }
}