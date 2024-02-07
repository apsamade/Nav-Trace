exports.getCgv = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    res.render('CG/cgv', { user, panier })
}