const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({


  nom: { type: String, required: true }
  
}) ;


const Category = mongoose.model("Categorie", categorySchema);
module.exports = Category;



