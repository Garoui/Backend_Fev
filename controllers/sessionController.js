const sessionModel = require('../models/sessionSchema');
//const userModel = require('../models/userSchema');

//ajouter session
module.exports.addSession = async (req, res) => {
    try {
        const { sessionTitre, description,dateDebut,dateFin } = req.body;
        //personalisation d'erreur
        const session = await sessionModel.create({
            sessionTitre, description, dateDebut, dateFin
        })
        res.status(200).json({ session });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher toutes les session
module.exports.getAllSession = async (req, res) => {
    try {
        //personalisation d'erreur
        const sessionList = await sessionModel.find();
        if (!sessionList || sessionList.length === 0) {
            throw new Error("Aucun session trouvé");
        }
        res.status(200).json(sessionList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher session avec id
module.exports.getSessionById = async (req, res) => {
    try {
        const id = req.params.id
        const session = await sessionModel.findById(id);
        //personalisation d'erreur
        if (!session || session.length === 0) {
            throw new Error("Session introuvable");
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//supprimer session avec id
module.exports.deleteSessionById = async (req, res) => {
    try {

        const id = req.params.id

        const sessionById = await sessionModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!sessionById || sessionById.length === 0) {
            throw new Error("Session introuvable");
        }
        await sessionModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//mise a jour session
module.exports.updateSession = async (req, res) => {
    try {
        const id = req.params.id;
        const { sessionTitre, description,dateDebut,dateFin } = req.body;
       const sessionById = await sessionModel.findById(id);
        //personalisation d'erreur
        if (!sessionById) {
            throw new Error("Session introuvable");
        }
        const updated = await sessionModel.findByIdAndUpdate(id, {
            $set: { sessionTitre,description,dateDebut,dateFin },
        })
        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}