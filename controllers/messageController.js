const messageModel = require('../models/messageSchema');
//const userModel = require('../models/userSchema');

//ajouter message
module.exports.addMessage = async (req, res) => {
    try {
        const { dateEnvoyer} = req.body;
        //personalisation d'erreur
        const message = await messageModel.create({
            dateEnvoyer
        })
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher toutes les message
module.exports.getAllMessages = async (req, res) => {
    try {
        //personalisation d'erreur
        const messageList = await messageModel.find();
        if (!messageList || messageList.length === 0) {
            throw new Error("Aucun message trouvé");
        }

        res.status(200).json(messageList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher message avec id
module.exports.getMessageById = async (req, res) => {
    try {
        const id = req.params.id
        const message = await messageModel.findById(id);
        //personalisation d'erreur
        if (!message || message.length === 0) {
            throw new Error("Message introuvable");
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//supprimer message avec id
module.exports.deleteMessageById = async (req, res) => {
    try {
        const id = req.params.id
        const messageById = await messageModel.findByIdAndDelete(id);
        //personalisation d'erreur
        if (!messageById || messageById.length === 0) {
            throw new Error("Message introuvable");
        }
        await messageModel.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//mise a jour message
module.exports.updateMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const { dateEnvoyer } = req.body;
        const mesaageById = await messageModel.findById(id);
        //personalisation d'erreur
        if (!mesaageById) {
            throw new Error("Message introuvable");
        }
        const updated = await messageModel.findByIdAndUpdate(id, {
            $set: { dateEnvoyer },
        })
        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}