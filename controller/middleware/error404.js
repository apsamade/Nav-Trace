exports.get404 = async (req, res, next)=>{
    const user = req.session.user
    res.render('404', { user })
}