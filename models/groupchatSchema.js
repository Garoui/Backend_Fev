const mongoose = require('mongoose');
const groupchatSchema = new mongoose.Schema({
    Nom_de_groupe: {
        type: String,
        required: false,
    },

    description: {
        type: String,
        required: false,

    },
    dateCreation: {
        type: Date,
        default: Date.now
    },


    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },//ONE TO MANY
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    enregistrements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Enregistrement" }],


});


const GroupChat = mongoose.model("GroupChat", groupchatSchema);
module.exports = GroupChat;