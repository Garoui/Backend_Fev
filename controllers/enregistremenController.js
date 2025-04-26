const planificationModel = require('../models/planificationSchema');
//const userModel = require('../models/userSchema');

//ajouter planification
module.exports.addPlanification = async (req, res) => {
    try {

        const { titre, description, formateur, date, niveau } = req.body;
        //personalisation d'erreur
        const planification = await planificationModel.create({
            titre, description, formateur, date, niveau
        })
        res.status(200).json({ planification });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getAllPlanification = async (req, res) => {
    try {
        //personalisation d'erreur
        const planificationList = await planificationModel.find();
        if (!planificationList || planificationList.length === 0) {
            throw new Error("Aucun planificationList trouvé");
        }

        res.status(200).json(formationList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getPlanificationById = async (req, res) => {
    try {

        const id = req.params.id
        const planification = await planificationModel.findById(id);
        //personalisation d'erreur
        if (!planification || planification.length === 0) {
            throw new Error("Planification introuvable");
        }

        res.status(200).json(planification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deletePlanificationById = async (req, res) => {
    try {

        const id = req.params.id

        const planificationById = await planificationModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!planificationById || planificationById.length === 0) {
            throw new Error("Planification introuvable");
        }
        await planificationModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.updatePlanification = async (req, res) => {
    try {
        const id = req.params.id;
        const { titre, description, formateur, date, niveau } = req.body;


        const planificationById = await planificationModel.findById(id);
        //personalisation d'erreur
        if (!planificationById) {
            throw new Error("Planification introuvable");
        }



        const updated = await planificationModel.findByIdAndUpdate(id, {
            $set: { titre, description, formateur, date, niveau },
        })


        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
