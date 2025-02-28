const userModel = require('../models/userSchema');

// add admin
module.exports.addUserAdmin = async(req,res) => {
    try {
        const {nom , prenom , email , password } = req.body;
        const roleAdmin = 'Admin'
        const admin = await userModel.create({
        nom,prenom,email ,password ,role  : roleAdmin
        })

        res.status(200).json({admin});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// get All admins
module.exports.getAllAdmins = async (req, res) => {
    try {
        //personalisation d'erreur
        const adminList = await userModel.find({role:'Admin'});
        if (!adminList || adminList.length === 0) {
            throw new Error("Aucun admin trouvé");
        }

        res.status(200).json(adminList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get admin with ID
module.exports.getAdminById = async (req, res) => {
  try {
    const admin = await userModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update admin
module.exports.updateAdminById = async (req, res) => {
  try {
    const admin = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete admin
module.exports.deleteAdminById = async (req, res) => {
  try {
    const admin = await userModel.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }
    res.status(200).json({ message: 'Admin supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};