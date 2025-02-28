const userModel = require('../models/userSchema');
const formationModel = require('../models/formationSchema');
const jwt = require('jsonwebtoken');

const maxTime = 24*60 *60 //24h
//const maxTime = 5*60 *60 //1min

const createToken = (id) => {
    return jwt.sign({id}, 'net secret pfe', {expiresIn: maxTime})
}
//67bb176822166b7d937591aa + net secret pfe + 1m
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmIxNzY4MjIxNjZiN2Q5Mzc1OTFhYSIsImlhdCI6MTc0MDMxNTM5MCwiZXhwIjoxNzQwNDAxNzkwfQ.lBVrcH2YxBfWlz5_PmfI1SbQC-eUOI18lLcUKuHwe3
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
module.exports.login= async (req,res) => {
    try {
        const {email , password } = req.body;
        const user = await userModel.login(email,password)
        const token = createToken(user._id)
        //console.log(token)
        res.cookie("jwt_token_abir",token, {httpOnly:false,maxAge:maxTime * 1000})
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports.logout= async (req,res) => {
    try {
        
        
        res.cookie("jwt_token_abir","", {httpOnly:false,maxAge:1})
        res.status(200).json("logged")
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}