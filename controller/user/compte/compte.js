exports.getCompte = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    if(user){
        res.render('compte/compte', { user, panier })
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