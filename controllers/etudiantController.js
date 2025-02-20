//const etudiantModel = require('../models/etudiantSchema');
const userModel =require('../models/userSchema')


//add étudiant
module.exports.addUserEtudiant = async(req,res) => {
    try {
        const {nom , prenom , niveau , email , password } = req.body;
        const roleEtudiant = 'Etudiant'
        const etudiant = await userModel.create({
        nom,prenom,email ,password ,niveau ,role : roleEtudiant
        })

        res.status(200).json({etudiant});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//get all étudiants
module.exports.getAllEtudiant = async (req, res) => {
  try {
    //personalisation d'erreur
    const etudiantList = await userModel.find();
    if (!etudiantList || etudiantList.length === 0) {
        throw new Error("Aucun etudiant trouvé");
    }

    res.status(200).json(etudiantList)
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// get étudiant with ID
module.exports.getEtudiantById = async (req, res) => {
  try {
    const etudiant = await userModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update étudiant
module.exports.updateEtudiantById = async (req, res) => {
  try {
    const etudiant = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json(etudiant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete étudiant
module.exports.deleteEtudiantById = async (req, res) => {
  try {
    const etudiant = await userModel.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json({ message: 'Étudiant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};