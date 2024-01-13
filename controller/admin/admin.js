exports.getAdmin = async (req, res, next)=>{
    const user = req.session.user
    if(user && user.admin){
        res.render('admin/admin', { user })
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