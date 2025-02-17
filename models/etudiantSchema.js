const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    match:[
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
  ],
  },
  niveau: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Etudiant',
  },
}, { timestamps: true });

const Etudiant = mongoose.model('Etudiant', etudiantSchema);
module.exports = Etudiant;