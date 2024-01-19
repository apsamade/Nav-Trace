const express = require('express');
const router = express.Router();
const webhookController = require('../controller/user/paiement/webhook');

router.post('/webhook/panier', webhookController.handleWebhook);

module.exports = router;