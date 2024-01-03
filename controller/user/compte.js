exports.getCompte = async (req, res, next)=>{
    const user = req.session.user
    if(user){
        res.render('compte', { user })
    }else{
        res.redirect('/connexion')
    }
}

exports.postCompte = (req, res, next)=>{
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('session detruite')
            res.redirect('/connexion');
        }
    });
}