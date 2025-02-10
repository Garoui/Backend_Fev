const userModel = require('../models/userSchema');

module.exports.addUserEtudiant = async(req,res) => {
    try {
        const {nom , prenom , email , password } = req.body;
        const roleEtudiant = 'Etudiant'
        const user = await userModel.create({
        nom,prenom,email ,password ,role : roleEtudiant
        })

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.addUserEtudiantWithImg = async(req,res) => {
    try {
        const {nom , prenom , email , password } = req.body;
        const roleEtudiant = 'Etudiant'
        const {filename}  = req.file


        const user = await userModel.create({
        nom,prenom,email ,password ,role : roleEtudiant , image : filename
        })

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.addUserAdmin = async(req,res) => {
    try {
        const {nom , prenom , email , password } = req.body;
        const roleAdmin = 'Admin'
        const user = await userModel.create({
        nom,prenom,email ,password ,role : roleAdmin
        })

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getAllUsers = async(req,res) => {
    try {
        const userListe = await userModel.find()
        

        res.status(200).json({userListe});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getUsersById = async(req,res) => {
    try {
        //const id= req.params.id
        const {id} = req.params
        //console.log(req.params)
        const user = await userModel.findById(id)
        

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports.deleteUsersById = async(req,res) => {
    try {
        const {id} = req.params

          const user = await userModel.findById(id);
          if (!user) {
            throw new Error("User not found");
          }

        await userModel.findByIdAndDelete(id)
        
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}