const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    titre: { type: String, required: true, unique: true },
     description: { type: String, required: true },
     formateur: { type: String , required: true },
     date: {type: String},
     niveau: {type: String},
     users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],//many to many


},
{timestamps: true}
);

const Formation = mongoose.model("Formations", formationSchema);
module.exports = Formation;