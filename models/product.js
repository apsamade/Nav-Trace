const mongoose = require('mongoose')

// projet
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    prix_achat: {
        type: String,
        trim: true,
        required: true
    },
    prix_abonnement: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });
// enregistrement du mot de passe hashé

const Product = mongoose.model('Product', productSchema, 'produits');
module.exports = Product;