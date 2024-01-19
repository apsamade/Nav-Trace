const express = require('express')
const router = express.Router()

const homeController = require('../controller/user/home')

const connexionController = require('../controller/user/login/connexion')
const inscriptionController = require('../controller/user/login/inscription')

const contactController = require('../controller/user/contact')

const blogController = require('../controller/user/blog')

const boutiqueController = require('../controller/user/boutique/boutique')
const produitController = require('../controller/user/boutique/produit')

const compteController = require('../controller/user/compte/compte')
const panierController = require('../controller/user/compte/panier')

const paiementController = require('../controller/user/paiement/paiement')
const confirmerController = require('../controller/user/paiement/confirmer')

router.get('/', homeController.getHome)
router.post('/', homeController.postHome)

router.get('/connexion', connexionController.getConnexion)
router.post('/connexion', connexionController.postConnexion)

router.get('/inscription', inscriptionController.getInscription)
router.post('/inscription', inscriptionController.postInscription)

router.get('/blog', blogController.getBlog)
router.post('/blog', blogController.postBlog)

router.get('/boutique', boutiqueController.getBoutique)
router.post('/boutique', boutiqueController.postBoutique)

router.get('/boutique/:id', produitController.getProduct)
router.post('/boutique/:id', produitController.postProduct)

router.get('/account', compteController.getCompte)
router.post('/account', compteController.postCompte)

router.get('/panier', panierController.getPanier)
router.post('/panier', panierController.postPanier)

router.get('/panier/:id/paiement', paiementController.getPayement)
router.post('/panier/:id/paiement', paiementController.postPayement)
router.get('/panier/:id/paiement/confirmer', confirmerController.getConfirmation)
router.post('/panier/:id/paiement/confirmer', confirmerController.postConfirmation)

router.get('/contact', contactController.getContact)
router.post('/contact', contactController.postContact)


module.exports = router