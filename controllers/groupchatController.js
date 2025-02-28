const groupchatModel = require('../models/groupchatSchema');

module.exports.addGroupChat = async (req, res) => {
    try {

        const { NomDeGroupe, description, dateCreation } = req.body;



        //personalisation d'erreur

        const groupchat = await groupchatModel.create({
            NomDeGroupe, description, dateCreation
        })


        res.status(200).json({ groupchat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports.getAllGroupChat = async (req, res) => {
    try {
        //personalisation d'erreur
        const groupchatList = await groupchatModel.find();
        if (!groupchatList || groupchatList.length === 0) {
            throw new Error("Aucun Groupchat trouvé");
        }

        res.status(200).json(groupchatList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getGroupChatById = async (req, res) => {
    try {

        const id = req.params.id
        const groupchat = await groupchatModel.findById(id);
        //personalisation d'erreur
        if (!groupchat || groupchat.length === 0) {
            throw new Error("GroupChat introuvable");
        }

        res.status(200).json(groupchat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.updateGroupChat = async (req, res) => {
    try {
        const id = req.params.id;
        const { NomDeGroupe, description, dateCreation} = req.body;


        const groupchatById = await groupchatModel.findById(id);
        //personalisation d'erreur
        if (!groupchatById) {
            throw new Error("GroupChat introuvable");
        }



        const updated = await groupchatModel.findByIdAndUpdate(id, {
            $set: { NomDeGroupe, description, dateCreation },
        })
        


        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteGroupChatById = async (req, res) => {
    try {

        const id = req.params.id

        const groupchatById = await groupchatModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!groupchatById || groupchatById.length === 0) {
            throw new Error("GroupChat introuvable");
        }
        await groupchatModel.findByIdAndDelete(id);

        res.status(200).json("Deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


