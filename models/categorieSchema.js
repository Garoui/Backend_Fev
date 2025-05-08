const mongoose = require('mongoose');
const categorieSchema = new mongoose.Schema({


  nom: { type: String, required: true },
  formations :[ {type : mongoose.Schema.Types.ObjectId,ref:'Formation'}],//ONE TO MANY
  
}) ;


const Categorie = mongoose.model("Categorie", categorieSchema);
module.exports = Categorie;



