const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    titre: { type: String, required: true, unique: true },
     description: { type: String, required: true },
     formateur: { type: String , required: true },
     date: {type: String},
     niveau: {type: String},
    


},
{timestamps: true}
);

const formation = mongoose.model("formation", formationSchema);
module.exports = formation;