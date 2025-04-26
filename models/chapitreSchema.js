const mongoose = require('mongoose');
const chapitreSchema = new mongoose.Schema({
    titre: { type: String },
  lienVideo: { type: String },

formation : {type : mongoose.Schema.Types.ObjectId,ref:'Formation'},//ONE TO MANY



}) ;


const Chapitre = mongoose.model("Chapitre", chapitreSchema);
module.exports = Chapitre;