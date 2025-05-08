const chapitreModel = require('../models/chapitreSchema');

// Add a chapter
module.exports.addChapitre = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Add this line
        const { titre, lienVideo, formationId } = req.body;
        
        if (!titre || !formationId) {
            return res.status(400).json({ message: "Titre and formationId are required" });
        }

        const chapitre = await chapitreModel.create({
            titre, 
            lienVideo: lienVideo || null,
            formation: formationId
        });

        res.status(201).json({ chapitre }); // 201 for resource creation

    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Get all chapters
module.exports.getAllChapitres = async (req, res) => {
    try {
        const chapitreList = await chapitreModel.find().populate('formation');
        
        if (!chapitreList?.length) {
            return res.status(404).json({ message: "Aucun chapitre trouvé" });
        }

        res.status(200).json(chapitreList);
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Get chapter by ID
module.exports.getChapitreById = async (req, res) => {
    try {
        const chapitre = await chapitreModel.findById(req.params.id).populate('formation');
        
        if (!chapitre) {
            return res.status(404).json({ message: "Chapitre introuvable" });
        }

        res.status(200).json(chapitre);
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Delete chapter by ID
module.exports.deleteChapitreById = async (req, res) => {
    try {
        const deletedChapitre = await chapitreModel.findByIdAndDelete(req.params.id);
        
        if (!deletedChapitre) {
            return res.status(404).json({ message: "Chapitre introuvable" });
        }

        res.status(200).json({ 
            message: "Chapitre supprimé avec succès",
            deletedChapitre 
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Update chapter
module.exports.updateChapitre = async (req, res) => {
    try {
        const { titre, lienVideo } = req.body;
        
        const updatedChapitre = await chapitreModel.findByIdAndUpdate(
            req.params.id,
            { titre, lienVideo },
            { new: true, runValidators: true } // Return updated doc and run validators
        ).populate('formation');

        if (!updatedChapitre) {
            return res.status(404).json({ message: "Chapitre introuvable" });
        }

        res.status(200).json({ updatedChapitre });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}