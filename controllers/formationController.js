const formationModel = require('../models/formationSchema');
const userModel = require('../models/userSchema');
const CategoryModel = require('../models/categorySchema'); // adapte le chemin si besoin

module.exports.getAllFormation = async (req, res) => {
    try {
        //personalisation d'erreur
        const formationList = await formationModel.find();
        if (!formationList || formationList.length === 0) {
            throw new Error("Aucun formation trouvé");
        }

        res.status(200).json(formationList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getFormationById = async (req, res) => {
    try {

        const id = req.params.id
        const formation = await formationModel.findById(id);
        //personalisation d'erreur
        if (!formation || formation.length === 0) {
            throw new Error("Formation introuvable");
        }

        res.status(200).json(formation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.deleteFormationById = async (req, res) => {
    try {

        const id = req.params.id

        const formationById = await formationModel.findByIdAndDelete(id);

        //personalisation d'erreur
        if (!formationById || formationById.length === 0) {
            throw new Error("Formation introuvable");
        }
        await formationModel.findByIdAndDelete(id);

        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports.addFormation = async (req, res) => {
  try {
    let { titre, description } = req.body;

    if (!titre || !description) {
      return res.status(400).json({ error: "Titre and description are required." });
    }

    titre = titre.trim();
    description = description.trim();

    // Catégorie par défaut
    let categoryName = "Autres";

    const lowerTitre = titre.toLowerCase();
    if (lowerTitre.includes("react") || lowerTitre.includes("node")) {
      categoryName = "Développement Web";
    } else if (lowerTitre.includes("python") || lowerTitre.includes("machine")) {
      categoryName = "Data Science";
    }

    // Trouver la catégorie par son nom
    const category = await CategoryModel.findOne({ nom: categoryName });

    if (!category) {
      return res.status(400).json({ error: `Catégorie "${categoryName}" introuvable.` });
    }

    const formation = await formationModel.create({
      titre,
      description,
      categorie: category._id // on enregistre l'ObjectId ici
    });

    res.status(201).json({ message: "Formation ajoutée", formation });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.updateFormation = async (req, res) => {
    try {
        const id = req.params.id;
        const { titre, specialite, formateur, dateCreation } = req.body;


        const formationById = await formationModel.findById(id);
        //personalisation d'erreur
        if (!formationById) {
            throw new Error("Formation introuvable");
        }



        const updated = await formationModel.findByIdAndUpdate(id, {
            $set: { titre, specialite, formateur, dateCreation },
        })


        res.status(200).json({ updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.affect = async (req, res) => {
    try {
        const { userId, formationId } = req.body;
        const formationById = await formationModel.findById(formationId);
        //personalisation d'erreur
        if (!formationById) {
            throw new Error("Formation introuvable");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        await formationModel.findByIdAndUpdate(formationId, {
            $push: { users: userId },
        });
        await userModel.findByIdAndUpdate(userId, {
            $push: { formations: formationId },
        })

        res.status(200).json( 'affected' );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.desaffect = async (req, res) => {
    try {
        const { userId, formationId } = req.body;
        const formationById = await formationModel.findById(formationId);
        //personalisation d'erreur
        if (!formationById) {
            throw new Error("Formation introuvable");
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        await formationModel.findByIdAndUpdate(formationId, {
            $pull: { users: userId }, //if it is user with relation one to many then i write unset:{user:1}
        });
        await userModel.findByIdAndUpdate(userId, {
            $pull: { formations: formationId },
        });

        res.status(200).json( 'desaffected' );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.getFormationsAvecCategorie = async (req, res) => {
    try {
      const formations = await formationModel.find().populate('categorie');
      res.json(formations);
    } catch (err) {
      res.status(500).json({ error: 'Erreur lors du chargement des cours' });
    }
  };