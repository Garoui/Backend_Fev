const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({


    dateEnvoyer: { type: Date, default: Date.now },

groupchat: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat", required: true }, // ID du groupe de chat
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  

}) ;


const Message = mongoose.model("Message", messageSchema);
module.exports = Message;