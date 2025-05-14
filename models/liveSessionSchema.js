const mongoose = require('mongoose');
const liveSessionSchema = new mongoose.Schema({
    sessionTitre: { type: String },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    
    formations: { type: mongoose.Schema.Types.ObjectId, ref: "Formations" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  });


const LiveSession = mongoose.model("LiveSession", liveSessionSchema);
module.exports = LiveSession;