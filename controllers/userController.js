const userModel = require('../models/userSchema');
const formationModel = require('../models/formationSchema');

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
        const userListe = await userModel.find()//.populate("formation") hedhi bech tkharjlk les donner de formation kol ta3 apprenant ou formateur
        

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
          await formationModel.updateMany({}, {
            $pull: { users:"userId"},
          });

        await userModel.findByIdAndDelete(id)
        
        res.status(200).json("deleted");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.updateuserById = async (req, res) => {
    try {
    const {id} = req.params
    const {email , nom , prenom} = req.body;
    

    await userModel.findByIdAndUpdate(id,{$set : {email , nom , prenom}})
    const updated = await userModel.findById(id)
    res.status(200).json({updated})
}
 catch (error) {
    res.status(500).json({message: error.message});
}
}
//fonction recherche
module.exports.searchUserByUsername = async (req, res) => {
    try {
  
    const {username:nom} = req.query
    if(!nom) {
      throw new Error("veuillez fournir un nom pour le recherche");
    }

   const userListe = await userModel.find({
    nom: {$regex:  nom ,$options: "i" }
   })
   if (!userListe) {
    throw new Error("User not fount");
   }
   const count = userListe.length
    res.status(200).json({userListe,count})
}
 catch (error) {
    res.status(500).json({message: error.message});
}
}
