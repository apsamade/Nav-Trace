const Product = require('../../../models/product')

exports.getDeleteProduct = async (req, res, next)=>{
    const user = req.session.user
    const productId = req.params.id
    const produit = await Product.findById(productId)
    if(user && user.admin){
        res.render('admin/product/deleteProduct', { user, produit })
    }else{
        res.redirect('/')
    }
}

exports.postDeleteProduct = async (req, res, next)=>{
    const user = req.session.user
    const productId = req.params.id
    try {
        if(user && user.admin){
            await Product.findByIdAndDelete(productId)
            console.log('Produit détruit avec succès !')
            res.render('admin/product/deleteProduct', { user, message: 'Produit supprimer avec succès !' })
        }else{
            res.redirect('/connexion')
        }        
    } catch (error) {
        console.log(error)
        const produit = await Product.findById(productId)
        res.render('admin/product/deleteProduct', { user, produit })
    }

}