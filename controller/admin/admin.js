exports.getAdmin = async (req, res, next)=>{
    const user = req.session.user
    const panier = req.session.panier
    if(user && user.admin){
        res.render('admin/admin', { user, panier })
    }else{
        res.redirect('/')
    }
}

exports.postAdmin = (req, res, next)=>{
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('session detruite')
            res.redirect('/connexion');
        }
    });
}