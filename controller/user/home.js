const Panier = require('../../models/panier')

exports.getHome = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    res.render('home', { user, panier })
}

exports.postHome = (req, res, next)=>{
    
}