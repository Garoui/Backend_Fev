const mongoose = require('mongoose');


const formateurSchema = new mongoose.Schema({
    
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
      },
      specialite: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: 'Formateur',
      },
    }, 
    
    { timestamps: true });
    

const formateur = mongoose.model("formateur", formateurSchema);
module.exports = formateur;