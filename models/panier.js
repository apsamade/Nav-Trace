const mongoose = require('mongoose');

// projet
const panierSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantite: {
                type: Number,
            },   
            prix: {
                type: Number
            }       
        }
    ],
    prix_total: {
        type: Number,
        required: true
    },
    quantite_total: {
        type: Number,
        required: true
    },
    payer: {
        type: Boolean,
    },
    nom: {
        type: String
    },
    prenom: {
        type: String
    },
    email: {
        type: String
    },
    tel: {
        type: Number
    },
    ville: {
        type: String
    },
    adresse_postale: {
        type: String
    },
    code_postal: {
        type: Number
    },
    facture: {
        data: Buffer,
        contentType: String, 
    },
    politique_accepter: {
        type: Boolean,
        default: false
    },
    paiement_stripe_id: {
        type: String
    },
    annuler: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
// enregistrement du mot de passe hashé

const Panier = mongoose.model('Panier', panierSchema, 'paniers');
module.exports = Panier;