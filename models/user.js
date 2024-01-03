const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// user
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'veuillez entrer votre Email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    mdp: {
        type: String,
        required: [true, "Veuillez entrer votre mot de passe"],
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
// enregistrement du mot de passe hashé

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('mdp')) return next();
    const hash = await bcrypt.hash(user.mdp, 10);
    user.mdp = hash;
    next();
});

const User = mongoose.model('User', userSchema, 'users');
module.exports = User;