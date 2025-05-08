const mongoose = require('mongoose');
const chapitreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  lienVideo: { type: String },




}) ;


const Chapitre = mongoose.model("Chapitre", chapitreSchema);
module.exports = Chapitre;