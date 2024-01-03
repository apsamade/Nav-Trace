const User = require('../../models/user')

exports.getInscription = (req, res, next)=>{
    res.render('inscription')
}

exports.postInscription = async (req, res, next)=>{
    const {email, mdp, mdpv} = req.body
    const userExisting = await User.findOne({email: email})
    try {
        if(userExisting){
            res.render('inscription', {error: 'Email déjà utiliser.'})
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
                console.log('user créer avec succes ! ', user.email) 
                req.session.user = user;
                res.redirect('/') 
            }else{
                res.render('inscription', {error: 'Mot de passe de confirmation différent.'})
            }
        }
    } catch (error) {
        console.log(error)
        res.render('inscription', {error: 'Erreur inattendue lors de la création de compte. Veuillez nous signaler cette erreur sur notre page de contact.'})
    }
}