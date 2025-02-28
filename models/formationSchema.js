const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    titre: { type: String, required: true, unique: true },
    specialite: { type: String, required: true },
    formateur: { type: String, required: true },
    dateCreation: { type: Date, default: Date.now },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],//many to many
    groupchats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupChat' }],//ONE TO MANY
    chapitres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapitre' }],//ONE TO MANY


},
    //{ timestamps: true }
);

const Formation = mongoose.model("Formations", formationSchema);
module.exports = Formation;