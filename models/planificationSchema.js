const mongoose = require('mongoose');
const planificationSchema = new mongoose.Schema({
   


    groupchat: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
}) ;


const Planification = mongoose.model("Planification", planificationSchema);
module.exports = Planification;