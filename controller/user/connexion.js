const User = require('../../models/user')
const bcrypt = require('bcrypt')

exports.getConnexion = (req, res, next)=>{
    res.render('connexion')
}

exports.postConnexion = async (req, res, next)=>{
    const {email, mdp} = req.body
    const userExisting = await User.findOne({email: email})
    try {
        if(userExisting && bcrypt.compareSync(mdp, userExisting.mdp)){
            req.session.user = userExisting
            console.log(req.session.user)
            res.redirect('/')
        }else{
            res.render('connexion')
        }
    } catch (error) {
        console.log(error)
        res.render('connexion')
    }
}