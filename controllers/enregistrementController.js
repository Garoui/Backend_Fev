const enregistrementModel = require('../models/enregistrementSchema');
//const userModel = require('../models/userSchema');

//ajouter enregistrement
module.exports.addEnregistrement = async (req, res) => {
    try {

        const { dateEnregistrement, titre, lienVideo } = req.body;



        //personalisation d'erreur

        const enregistrement = await enregistrementModel.create({
            dateEnregistrement, titre, lienVideo
        })


        res.status(200).json({ enregistrement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher toutes les enregistrement
module.exports.getAllEnregistrement = async (req, res) => {
    try {
        //personalisation d'erreur
        const enregistrementList = await enregistrementModel.find();
        if (!enregistrementList || enregistrementList.length === 0) {
            throw new Error("Aucun chapitre trouvé");
        }

        res.status(200).json(enregistrementList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//afficher enregistrement avec id
module.exports.getEnregistrementById = async (req, res) => {
    try {

        const id = req.params.id
        const enregistrement = await enregistrementModel.findById(id);
        //personalisation d'erreur
        if (!enregistrement || enregistrement.length === 0) {
            throw new Error("Enregistrement introuvable");
        }

        res.status(200).json(enregistrement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//supprimer enregistrement avec id
module.exports.deleteEnregistrementById = async (req, res) => {
    try {

        const id = req.params.id

        const enregistrementById = await enregistrementModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!enregistrementById || enregistrementById.length === 0) {
            throw new Error("Enregistrement introuvable");
        }
        await enregistrementModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//mise a jour enregistrement
module.exports.updateEnregistrement = async (req, res) => {
    try {
        const id = req.params.id;
        const { dateEnregistrement, titre,lienVideo } = req.body;


        const enregistrementById = await enregistrementModel.findById(id);
        //personalisation d'erreur
        if (!enregistrementById) {
            throw new Error("Enregistrement introuvable");
        }

        const updated = await enregistrementModel.findByIdAndUpdate(id, {
            $set: { dateEnregistrement,titre,lienVideo },
        })


        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}