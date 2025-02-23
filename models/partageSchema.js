const mongoose = require('mongoose');
const partageSchema = new mongoose.Schema({
   





groupchat: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat", required: true }, // ID du groupe de chat
  enregistrement: { type: mongoose.Schema.Types.ObjectId, ref: "Enregistrement", required: true }, // ID de l'enregistrement partagé
  
}) 
  const Partage = mongoose.model("Partage", partageSchema);
  module.exports = Partage;