//const apprenantModel = require('../models/apprenantSchema');
const userModel =require('../models/userSchema')


//add étudiant
module.exports.addUserApprenant = async(req,res) => {
    try {
        const {nom , prenom , email , password } = req.body;
        const roleApprenant = 'Apprenant'
        const apprenant = await userModel.create({
        nom,prenom,email ,password ,role : roleApprenant
        })

        res.status(200).json({apprenant});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//get all étudiants
module.exports.getAllApprenant = async (req, res) => {
  try {
    //personalisation d'erreur
    const apprenantList = await userModel.find({role:'Apprenant'});
    if (!apprenantList || apprenantList.length === 0) {
        throw new Error("Aucun apprenant trouvé");
    }

    res.status(200).json(apprenantList)
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

// get étudiant with ID
module.exports.getApprenantById = async (req, res) => {
  try {
    const apprenant = await userModel.findById(req.params.id);
    if (!apprenant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json(apprenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update étudiant
module.exports.updateApprenantById = async (req, res) => {
  try {
    const apprenant = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!apprenant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json(apprenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete étudiant
module.exports.deleteApprenantById = async (req, res) => {
  try {
    const apprenant = await userModel.findByIdAndDelete({role:'Apprenant'});
    if (!apprenant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    res.status(200).json({ message: 'Étudiant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};