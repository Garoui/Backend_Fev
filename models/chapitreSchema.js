const mongoose = require('mongoose');
const chapitreSchema = new mongoose.Schema({
    chapTitre: {
        type: String,
        required: false,
        unique: true,
    },

    date: {
        type: Date,
        
    },


formation : {type : mongoose.Schema.Types.ObjectId,ref:'Formation'},//ONE TO MANY



}) ;


const Chapitre = mongoose.model("Chapitre", chapitreSchema);
module.exports = Chapitre;