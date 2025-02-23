const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    sessionTitre: {
        type: String,
        required: false,
        unique: true,
    },

    description: {
        type: String,
        required: false,
        
    },
    dateDebut: {
        type: String,
        required: false,
        
    },

    datefin: {
        type: String,
        required: false,
        
    },
    createdAt: { type: Date, default: Date.now },
    groupchats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Groupchat" }],
});
const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;