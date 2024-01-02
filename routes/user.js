const express = require('express')
const router = express.Router()

const homeController = require('../controller/user/home')

const connexionController = require('../controller/user/connexion')
const inscriptionController = require('../controller/user/inscription')

router.get('/', homeController.getHome)
router.post('/', homeController.postHome)

router.get('/connexion', connexionController.getConnexion)
router.post('/connexion', connexionController.postConnexion)

router.get('/inscription', inscriptionController.getInscription)
router.post('/inscription', inscriptionController.postInscription)


module.exports = router