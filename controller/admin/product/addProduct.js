const Product = require('../../../models/product')
const fs = require('fs')
const imgbbUploader = require('imgbb-uploader');
const path = require('path')

exports.getAddProduct = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    if (user && user.admin) {
        res.render('admin/product/addProduct', { user })
    } else {
        res.redirect('/')
    }
}

exports.postAddProduct = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const { name, prixAchat, prixAbonnement, description } = req.body
    const { image } = req.files
    let endPathFile = ('/public/img/' + image.name)
    let uploadPath = (path.join(__dirname + '../../../../' + endPathFile))
    if (user && user.admin) {
        if (name && prixAchat && image && prixAbonnement && description) {
            image.mv(uploadPath, async function (err) {
                if (err) {
                    return res.status(500).send(err)
                } else {
                    try {
                        const imgbbResponse = await imgbbUploader(process.env.IMGBB_API_KEY, uploadPath);
                        console.log('ImgBB response:', imgbbResponse);
                        const produit = new Product({
                            name: name,
                            prix_achat: prixAchat,
                            image: imgbbResponse.url,
                            prix_abonnement: prixAbonnement,
                            description: description
                        });
                        await produit.save();
                        fs.unlinkSync(uploadPath)
                        res.render('admin/product/addProduct', {user, message: 'produit ajouté avec succès !', produit, panier})
                    } catch (error) {
                        console.error('Error uploading to ImgBB:', error.message);
                        res.redirect('/admin');
                    }
                }
            })
        } else {

        }
    } else {
        res.redirect('/')
    }

}