const mongoose = require('mongoose');
const enregistrementSchema = new mongoose.Schema({
    dateEnregistrement: { 
        type: Date, 
        default: Date.now 
    },
    titre: { 
        type: String, 
        required: true
     },
     lienVideo: { 
        type: String, 
        required: true 
    }, 




    groupchats: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" }],

}) ;


const Enregistrement = mongoose.model("Enregistrement", enregistrementSchema);
module.exports = Enregistrement;