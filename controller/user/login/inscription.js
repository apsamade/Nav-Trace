const User = require('../../../models/user')
const Panier = require('../../../models/panier')

exports.getInscription = (req, res, next)=>{
    const panier = req.session.panier
    res.render('login/inscription', {panier})
}

exports.postInscription = async (req, res, next)=>{
    const panier = req.session.panier
    const {email, mdp, mdpv} = req.body
    const userExisting = await User.findOne({email: email})
    try {
        if(userExisting){
            res.render('login/inscription', {error: 'Email déjà utiliser.', panier})
        }else{
            if(mdp === mdpv){
                const user = new User({
                    email: email,
                    mdp: mdp
                })   
                if(email == process.env.EMAIL_ADMIN){
                    user.admin = true;
                }else{
                    user.admin = undefined;
                }
                await user.save()
                if(panier && !panier.user_id){
                    panier.user_id = user._id
                    await Panier.findByIdAndUpdate(panier._id, {
                        $set: {
                            user_id: user._id
                        }
                    })
                }
                console.log('user créer avec succes ! ', user.email) 
                req.session.user = user;
                if(req.query.passer_commande === 'true' && panier){
                    res.redirect(`/panier/${panier._id}/paiement`);
                }else{
                    res.redirect('/') 
                }

            }else{
                res.render('login/inscription', {error: 'Mot de passe de confirmation différent.', panier})
            }
        }
    } catch (error) {
        console.log(error)
        res.render('login/inscription', {error: 'Erreur inattendue lors de la création de compte. Veuillez nous signaler cette erreur sur notre page de contact.', panier})
    }
}