const mongoose = require('mongoose');
const user = require('./userSchema');

const administrateurSchema = new mongoose.Schema({
    privileges: { type: [String], default: ['gestion_cours', 'gestion_utilisateurs', 'maintenance'] }
});

//module.exports = user.discriminator('Administrateur', administrateurSchema);
const user = mongoose.model('Administrateur', administrateurSchema);
module.exports = user;