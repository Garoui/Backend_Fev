const CategorieModel = require('../models/categorieSchema');
 const formationModel = require('../models/formationSchema');


//  module.exports.getFormationsGroupedByCategory = async (req, res) => {
//     try {
//       const groupedFormations = await FormationModel.aggregate([
//         {
//           $lookup: {
//             from: "categories", // nom de la collection MongoDB (en minuscule/pluriel)
//             localField: "categorie",
//             foreignField: "_id",
//             as: "categorieDetails"
//           }
//         },
//         {
//           $unwind: "$categorieDetails"
//         },
//         {
//           $group: {
//             _id: "$categorieDetails.nom", // ou "name" selon ton modèle
//             formations: {
//               $push: {
//                 titre: "$titre",
//                 description: "$description"
//               }
//             }
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             categorie: "$_id",
//             formations: 1
//           }
//         }
//       ]);
  
//       res.status(200).json(groupedFormations);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  
// Obtenir toutes les catégories
 module.exports.getAllCategories = async (req, res) => {
   try {
     const categories = await CategorieModel.find();
    res.status(200).json(categories);
   } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
     res.status(500).json({ message: "Erreur serveur" });
   }
 };

// Obtenir une catégorie par ID
// module.exports.getCategoryById = async (req, res) => {
//   try {
//     const categorie = await CategoryModel.findById(req.params.id);
//     if (!categorie) {
//       return res.status(404).json({ message: "Catégorie non trouvée" });
//     }
//     res.status(200).json(categorie);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// Créer une nouvelle catégorie
 module.exports.addCategory = async (req, res) => {
   try {
     const { nom } = req.body;
     const newCategorie = new CategorieModel({ nom });
     await newCategorie.save();
     res.status(201).json(newCategorie);
   } catch (error) {
     res.status(400).json({ message: "Erreur lors de la création", error });
   }
 };

// Mettre à jour une catégorie existante
// module.exports.updateCategory = async (req, res) => {
//   try {
//     const updated = await CategoryModel.findByIdAndUpdate(
//       req.params.id,
//       { nom: req.body.nom },
//       { new: true }
//     );
//     if (!updated) {
//       return res.status(404).json({ message: "Catégorie non trouvée" });
//     }
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(400).json({ message: "Erreur lors de la mise à jour", error });
//   }
// };

// Supprimer une catégorie
// module.exports.deleteCategory = async (req, res) => {
//   try {
//     const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Catégorie non trouvée" });
//     }
//     res.status(200).json({ message: "Catégorie supprimée" });
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };
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
