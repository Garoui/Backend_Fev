const chapitreModel = require('../models/chapitreSchema');
//const userModel = require('../models/userSchema');

//ajouter chapitre
module.exports.addChapitre = async (req, res) => {
    try {

        const { chapTitre, date } = req.body;



        //personalisation d'erreur

        const chapitre = await chapitreModel.create({
            chapTitre, date
        })


        res.status(200).json({ chapitre });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher toutes les chapitre
module.exports.getAllChapitres = async (req, res) => {
    try {
        //personalisation d'erreur
        const chapitreList = await chapitreModel.find();
        if (!chapitreList || chapitreList.length === 0) {
            throw new Error("Aucun chapitre trouvé");
        }

        res.status(200).json(chapitreList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher chapitre avec id
module.exports.getChapitreById = async (req, res) => {
    try {

        const id = req.params.id
        const chapitre = await chapitreModel.findById(id);
        //personalisation d'erreur
        if (!chapitre || chapitre.length === 0) {
            throw new Error("Chapitre introuvable");
        }

        res.status(200).json(chapitre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//supprimer chapitre avec id
module.exports.deleteChapitreById = async (req, res) => {
    try {

        const id = req.params.id

        const chapitreById = await chapitreModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!chapitreById || chapitreById.length === 0) {
            throw new Error("Chapitre introuvable");
        }
        await chapitreModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//mise a jour chapitre
module.exports.updateChapitre = async (req, res) => {
    try {
        const id = req.params.id;
        const { chapTitre, date } = req.body;


        const chapitreById = await chapitreModel.findById(id);
        //personalisation d'erreur
        if (!chapitreById) {
            throw new Error("Chapitre introuvable");
        }

        const updated = await chapitreModel.findByIdAndUpdate(id, {
            $set: { chapTitre,date },
        })


        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
