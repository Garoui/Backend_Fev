const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    titre: { type: String, required: true},
    description: {String},
    dateCreation: { type: Date, default: Date.now },
    chapitres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre' }],//ONE TO MANY
 
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie' },
    Formateur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ressources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ressource" }],
  
},
    //{ timestamps: true }
);

const Formation = mongoose.model("Formations", formationSchema);
module.exports = Formation;