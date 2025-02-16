const mongoose = require('mongoose');
const user = require('./userSchema');

const formateurSchema = new mongoose.Schema({
    specialite: { type: String, required: true }
});

// Héritage de la classe Utilisateur
//module.exports = user.discriminator('Formateur', formateurSchema);
const user = mongoose.model("user", userSchema);
module.exports = user;