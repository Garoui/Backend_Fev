const formationModel = require('../models/formationSchema');
const userModel = require('../models/userSchema');
const CategorieModel = require('../models/categorieSchema'); // adapte le chemin si besoin
const ChapitreModel = require('../models/chapitreSchema')
// formationController.js
module.exports.getMyFormation = async (req, res) => {
    try {
       // Verify authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Get formations for the current user
    const formations = await formationModel.find({ userId: req.user._id })
      .populate('category') // If you need category data
      .exec();

    res.status(200).json({ formations });
  } catch (error) {
    console.error('Error in getMyFormation:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
};



module.exports.getAllFormation = async (req, res) => {
    try {
        //personalisation d'erreur
        const formationList = await formationModel.find().populate('categorie').populate('chapitres');
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
//   try {
//     let { titre, description } = req.body;

//     if (!titre || !description) {
//       return res.status(400).json({ error: "Titre and description are required." });
//     }

//     titre = titre.trim();
//     description = description.trim();

//     // Catégorie par défaut
//     let categoryName = "Autres";

//     const lowerTitre = titre.toLowerCase();
//     if (lowerTitre.includes("react") || lowerTitre.includes("node")) {
//       categoryName = "Développement Web";
//     } else if (lowerTitre.includes("python") || lowerTitre.includes("machine")) {
//       categoryName = "Data Science";
//     }

//     // Trouver la catégorie par son nom
//     const category = await CategoryModel.findOne({ nom: categoryName });

//     if (!category) {
//       return res.status(400).json({ error: `Catégorie "${categoryName}" introuvable.` });
//     }

//     const formation = await formationModel.create({
//       titre,
//       description,
//       categorie: category._id // on enregistre l'ObjectId ici
//     });

//     res.status(201).json({ message: "Formation ajoutée", formation });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
try {
    const { titre, description, nomCategorie, chapitres } = req.body;

    // Trouver ou créer la catégorie
    let categorie = await CategorieModel.findOne({ nom: nomCategorie });
    if (!categorie) {
      categorie = await CategorieModel.create({ nom: nomCategorie });
    }

    // Créer les chapitres et récupérer leurs IDs
    const chapitreIds = [];
    for (const chap of chapitres) {
      const nouveauChapitre = await ChapitreModel.create({
        titre: chap.titre,
        lienVideo: chap.lienVideo
      });
      chapitreIds.push(nouveauChapitre._id);
    }

    // Créer le cours
    const formations = await formationModel.create({
      titre,
      description,
      categorie: categorie._id,
      chapitres: chapitreIds
    });

    res.status(201).json({ message: 'Cours créé', formations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
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

module.exports.getFormationsGroupedByCategory = async (req, res) => {
    try {
      const groupedFormations = await formationModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "categorie",
            foreignField: "_id",
            as: "categorieDetails"
          }
        },
        {
          $unwind: "$categorieDetails"
        },
        {
          $group: {
            _id: "$categorieDetails._id", // Group by category ID
            categorie: { $first: "$categorieDetails.nom" }, // Keep category name
            formations: {
              $push: {
                _id: "$_id", // Include formation ID for reference
                titre: "$titre",
                description: "$description",
                // Add any other formation fields you need
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            categorie: 1,
            categorieId: "$_id", // Explicitly include category ID
            formations: 1
          }
        },
        {
          $sort: { categorie: 1 } // Sort alphabetically by category name
        }
      ]);
  
      res.status(200).json(groupedFormations);
    } catch (err) {
      console.error("Error in getFormationsGroupedByCategory:", err);
      res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  };
  module.exports.getFormationsByCategorieId = async (req, res) => {
    try {
      const { id } = req.params;
      const formations = await formationModel.find({ categorie: id })
        .populate('categorie')
        .populate('chapitres');
        
      if (!formations || formations.length === 0) {
        return res.status(404).json({ message: "Aucune formation trouvée pour cette catégorie." });
      }
  
      res.status(200).json(formations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  