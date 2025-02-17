
const formateurModel = require('../models/formateurSchema');
const userModel = require('../models/userSchema');

//add formateur
module.exports.addUserFormateur = async(req,res) => {
    try {
        const {nom , prenom , email , password , specialite } = req.body;
        const roleFormateur = 'Formateur'
        const formateur = await formateurModel.create({
        nom,prenom,email ,password ,specialite ,role : roleFormateur
        })

        res.status(200).json({formateur});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


// get all  formateurs
module.exports.getAllFormateurs = async (req, res) => {
  try {
    //personalisation d'erreur
    const formateurList = await formateurModel.find();
    if (!formateurList || formateurList.length === 0) {
        throw new Error("Aucun formateur trouvé");
    }

    res.status(200).json(formateurList)
} catch (error) {
    res.status(500).json({ message: error.message });
}
  };


  // get formateur with ID
module.exports.getFormateursById = async (req, res) => {
    try {
      const formateur = await formateurModel.findById(req.params.id);
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur non trouvé' });
      }
      res.status(200).json(formateur);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // update formateur
module.exports.updateFormateurById = async (req, res) => {
    try {
      const formateur = await formateurModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur non trouvé' });
      }
      res.status(200).json(formateur);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // delete formateur
module.exports.deleteFormateurById = async (req, res) => {
    try {
      const formateur = await formateurModel.findByIdAndDelete(req.params.id);
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur non trouvé' });
      }
      res.status(200).json({ message: 'Formateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };