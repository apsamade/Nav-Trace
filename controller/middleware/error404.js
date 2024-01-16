exports.get404 = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    res.render('404', { user, panier })
}