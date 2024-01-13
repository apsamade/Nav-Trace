exports.getBoutique = async (req, res, next)=>{
    const user = req.session.user
    res.render('boutique/boutique', { user })
}

exports.postBoutique = (req, res, next)=>{

}