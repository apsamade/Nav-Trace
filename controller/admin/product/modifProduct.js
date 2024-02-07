const Product = require('../../../models/product')
const imgbbUploader = require('imgbb-uploader')
const fs = require('fs')
const path = require('path')

exports.getModifProduct = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const productId = req.params.id
    const produit = await Product.findById(productId)
    if (user && user.admin) {
        res.render('admin/product/modifProduct', { user, produit, panier })
    } else {
        res.redirect('/')
    }
}

exports.postModifProduct = async (req, res, next) => {
    const user = req.session.user
    const panier = req.session.panier
    const productId = req.params.id
    const { name, description, prixAchat, prixAbonnement } = req.body
    try {
        if (name && user.admin) {
            await Product.findByIdAndUpdate(productId, {
                $set: {
                    name: name
                }
            })
            console.log('marque mis a jour : ', name)
        }
        if (description && user.admin) {
            await Product.findByIdAndUpdate(productId, {
                $set: {
                    description: description
                }
            })
            console.log('marque mis a jour : ', description)
        }
        if (prixAchat && user.admin) {
            await Product.findByIdAndUpdate(productId, {
                $set: {
                    prix_achat: prixAchat
                }
            })
            console.log('marque mis a jour : ', prixAchat)
        }
        if (prixAbonnement && user.admin) {
            await Product.findByIdAndUpdate(productId, {
                $set: {
                    prix_abonnement: prixAbonnement
                }
            })
            console.log('marque mis a jour : ', prixAbonnement)
        }
        if (req.files && req.files.image && user.admin) {
            const  image  = req.files.image
            let endPathFile = ('/public/img/' + image.name)
            let uploadPath = (path.join(__dirname + '../../../../' + endPathFile))
            console.log(uploadPath)

            image.mv(uploadPath, async function (err) {
                if (err) {
                    return res.status(500).send(err)
                } else {
                    try {
                        const imgbbResponse = await imgbbUploader(process.env.IMGBB_API_KEY, uploadPath);
                        console.log('ImgBB response:', imgbbResponse);
                        await Product.findByIdAndUpdate(productId, {
                            $set: {
                                image: imgbbResponse.url
                            }
                        })
                        fs.unlinkSync(uploadPath)
                        console.log('image modifier avec succes : ', imgbbResponse.url)
                    } catch (error) {
                        console.error('Error uploading to ImgBB:', error.message);
                    }
                }
            })
        }
        if (user && user.admin && (req.files || name || description || prixAbonnement || prixAchat)) {
            const produit = await Product.findById(productId)
            return res.render('admin/product/modifProduct', { user, produit, message: 'Produit modifié avec succès !', panier })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
        return res.redirect('/admin/boutique');
    }
}