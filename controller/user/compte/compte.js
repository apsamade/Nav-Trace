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
    delete req.session.user;
    delete req.session.panier;

    console.log('session utilisateur supprimée');
    res.redirect('/connexion');

}