const mongoose = require('mongoose');
const ressourceSchema = new mongoose.Schema({
   

  nom: { type: String },
  formations: { type: mongoose.Schema.Types.ObjectId, ref: "Formations" }  
}) 
  const Ressource = mongoose.model("Ressource", ressourceSchema);
  module.exports = Ressource;