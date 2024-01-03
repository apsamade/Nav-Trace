

exports.getHome = async (req, res, next)=>{
    const user = req.session.user
    res.render('home', { user })
}

exports.postHome = (req, res, next)=>{
    
}