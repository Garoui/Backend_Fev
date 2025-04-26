const mongoose = require('mongoose');
const enregistrementSchema = new mongoose.Schema({
    
    titre: { 
        type: String, 
        required: true
     },
     lienVideo: { 
        type: String, 
        required: true 
    }, 
    liveSession: { type: mongoose.Schema.Types.ObjectId, ref: "LiveSession" }




}) ;


const Enregistrement = mongoose.model("Enregistrement", enregistrementSchema);
module.exports = Enregistrement;