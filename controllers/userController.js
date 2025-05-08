
const userModel = require('../models/userSchema');
const formationModel = require('../models/formationSchema');
const jwt = require('jsonwebtoken');
const uploadfile = require('../middlewares/uploadFile');
const maxTime = 3 * 24 * 60 * 60* 1000 //24h
//const maxTime = 5*60 *60 //1min
const bcrypt = require('bcrypt')
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: maxTime })
};
//67bb176822166b7d937591aa + net secret pfe + 1m
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmIxNzY4MjIxNjZiN2Q5Mzc1OTFhYSIsImlhdCI6MTc0MDMxNTM5MCwiZXhwIjoxNzQwNDAxNzkwfQ.lBVrcH2YxBfWlz5_PmfI1SbQC-eUOI18lLcUKuHwe3


module.exports.addUser = async (req, res) => {
    try {
        let { nom, prenom, email, password, role, specialite, ville, numTel } = req.body;
        let formations = [];
        
        if (role === "Apprenant") {
            if (!req.body.formations) {
              return res.status(400).json({ 
                message: "Formation requise pour l'apprenant",
                details: "Le champ 'formations' est manquant ou vide"
              });
            }
          
            // Recherche insensible à la casse et avec trim()
            const formationDoc = await formationModel.findOne({ 
                titre: req.body.formations 
            });
          
            if (!formationDoc) {
              return res.status(400).json({ 
                message: `Formation introuvable: ${req.body.formations}`,
                suggestion: "Vérifiez le titre ou contactez l'administrateur"
              });
            }
          
            formations = [formationDoc._id];
          }

        let cv = "";
        if (req.file) {
            cv = req.file.filename;
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé",
                error: "DUPLICATE_EMAIL"
            });
        }

        if (role === "Apprenant" && formations.length === 0) {
            return res.status(400).json({ message: "Une formation est obligatoire pour les étudiants" });
        }

        if (role === "Formateur" && (!specialite || !req.file)) {
            return res.status(400).json({ message: "Spécialité et CV sont obligatoires pour les formateurs" });
        }
        
        const newUser = new userModel({
            nom,
            prenom,
            email,
            password,
            numTel,
            ville,
            role,
            ...(role === "Apprenant" && { formations }),
            ...(role === "Formateur" && { specialite, cv })
        });

        const savedUser = await newUser.save();
        let userResponse;

        if (role === "Apprenant") {
            const populatedUser = await userModel.findById(savedUser._id).populate({
                path: 'formations',
                select: 'titre -_id'
            });
            userResponse = populatedUser.toObject();
        } else {
            userResponse = savedUser.toObject();
        }

        // Clean up response
        delete userResponse.password;
        delete userResponse.__v;
        
        // For Formateur, ensure all fields are included
        if (role === "Formateur") {
            userResponse = {
                _id: userResponse._id,
                nom: userResponse.nom,
                prenom: userResponse.prenom,
                email: userResponse.email,
                numTel: userResponse.numTel,
                ville: userResponse.ville,
                role: userResponse.role,
                specialite: userResponse.specialite,
                cv: userResponse.cv,
                createdAt: userResponse.createdAt
                
            };
        }

        return res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: userResponse
        });

    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé",
                error: "DUPLICATE_EMAIL"
            });
        }
        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};
module.exports.addUserAdminWithImg = async (req, res) => {
    try {
        const { nom, prenom, email, password } = req.body;
        const roleAdmin = 'Admin'
        const { filename } = req.file


        const user = await userModel.create({
            nom, prenom, email, password, role: roleAdmin, image: filename
        })

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.addUserAdmin = async (req, res) => {
    try {
        const { nom, prenom, email, motdepasse } = req.body;
        const roleAdmin = 'Admin'
        const user = await userModel.create({
            nom, prenom, email, motdepasse, role: roleAdmin
        })

        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getAllFormateurs = async (req, res) => {
    try {
      //personalisation d'erreur
      const formateurList = await userModel.find({role:'Formateur'});
      // if (!formateurList || formateurList.length === 0) {
      //     throw new Error("Aucun formateur trouvé");
      // }
  
      res.status(200).json({formateurList});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
    };
    module.exports.getAllUsers = async (req, res) => {
        try {
            const populateOptions = {
                path: 'formations',
                select: 'titre -_id' // 
            };
            // Si tu veux obtenir uniquement les formateurs
            if (req.query.role === "Formateur") {
                const formateurListe = await userModel.find({ role: "Formateur" })
                    .populate(populateOptions);
                return res.status(200).json({ formateurListe });
            }
            // Si tu veux obtenir uniquement les étudiants
            if (req.query.role === "Apprenant") {
                const apprenantListe = await userModel.find({ role: "Apprenant" })
                    .populate(populateOptions);
                return res.status(200).json({ apprenantListe });
            }
            // Si aucune condition n'est précisée, retourne tous les utilisateurs
            const userListe = await userModel.find()
            .populate(populateOptions);
        
        res.status(200).json({ userListe });
    
        } catch (error) {
            console.error("Erreur dans getAllUsers:", error);
            res.status(500).json({ 
                message: "Erreur serveur",
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
    
// Dans votre contrôleur users
module.exports.updateProfile = async (req, res) => {
    try {
      const { id } = req.user; // L'ID devrait venir du token JWT
      const updated = await userModel.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
module.exports.getUsersById = async (req, res) => {
    try {
        //const id= req.params.id
        const { id } = req.params
        //console.log(req.params)
        const user = await userModel.findById(id)


        res.status(200).json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports.getMyProfile = async (req, res) => {
    try {
      const userId = req.user.id; // `req.user` est rempli par le middleware
      const user = await userModel.findById(userId).select('-password'); // ne pas retourner le mdp
  
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports.deleteUsersById = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("ID reçu :", req.params.id);
        
        const user = await userModel.findById( req.params.id);
        console.log("Utilisateur trouvé :", user);
        if (!user) {
            throw new Error("User not found");
        }
        await formationModel.updateMany({}, {
            $pull: { users: userId },
        });

        await userModel.findByIdAndDelete(userId);

        res.status(200).json("deleted");
    } catch (error) {
        console.error("Erreur suppression :", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params
        const { email, nom, prenom,ville ,numTel, specialite,  } = req.body;


        await userModel.findByIdAndUpdate(id, { $set: { email, nom, prenom ,ville ,numTel, specialite,} })
        const updated = await userModel.findById(id)
        res.status(200).json({ updated })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//fonction recherche
module.exports.searchUserByUsername = async (req, res) => {
    try {

        const { nom } = req.query
        if (!nom) {
            throw new Error("veuillez fournir un nom pour le recherche");
        }

        const userListe = await userModel.find({
            nom: { $regex: nom, $options: "i" }
        })
        if (!userListe) {
            throw new Error("User not fount");
        }
        const count = userListe.length
        res.status(200).json({ userListe, count })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// module.exports.login = async (req, res) => {
//     try {
//         const { email,password } = req.body;
//         const user = await userModel.findOne({email});
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(400).json({ message: "Email ou mot de passe invalide" });
//         }
//         const token = createToken(user._id);

//         //console.log(token)
//         res.cookie("jwt_token_abir", token, 
//             { httpOnly: true,
//              maxAge: maxTime * 1000 })
//         res.status(200).json({ token, 
//             user: {
//             _id: user._id,
//             email: user.email,
//             role: user.role,
//             nom: user.nom,
//             ville: user.ville,
//             formation: user.formation
//           } });
//     } catch (error) {
//         console.log("Erreur backend :", error.message);
//         res.status(500).json({ message: error.message });
//     }
// }
module.exports.login = async (req, res) => {
    try {
       const { email, password } = req.body;
       console.log("Tentative de login avec :", email, password);

         const user = await userModel.findOne({email});
         if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });

         }
        console.log("Utilisateur trouvé :", user);
 // Comparer le mot de passe
//  console.log("Mot de passe fourni:", password);
//         console.log("Mot de passe dans la base:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Correspondance des mots de passe:", isMatch);

        if (!isMatch) {
          
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }
       const token = createToken(user._id);
        res.cookie("jwt_token_abir", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production',maxAge: maxTime * 1000 });
        
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({ user: userResponse });

     } catch (error) {
        console.error("Erreur dans login backend :", error.message);
        res.status(500).json({ message: error.message });
     }
 };




 
// module.exports.login = async (req, res) => {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({ message: "Email ou mot de passe manquant" });
//       }

//       const user = await userModel.login(email, password);

//       const token = createToken(user._id);

//       res.cookie("jwt_token_abir", token, {
//         httpOnly: false,
//         maxAge: maxTime * 1000,
//       });

//       res.status(200).json({ user, token });
//     } catch (error) {
//       console.error("Erreur lors du login :", error);
//       res.status(500).json({ message: error.message });
//     }
//   };
module.exports.signin = async (req, res) => {
    try {
        const { email, password, nom,prenom, numTel } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur existe déjà.' });
        }
        if (!/^[0-9]{8}$/.test(numTel)) {
            return res.status(400).json({ message: "Numéro de téléphone invalide. Il doit contenir exactement 8 chiffres." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = await userModel.create({ email, password: hashedPassword, prenom, nom, numTel });

        // Generate token
        const token = createToken(newUser._id);

        // Set cookie
        res.cookie("jwt_token_abir", token, { httpOnly: true, maxAge: maxTime * 1000 });

        // Return user
        res.status(201).json({ user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports.logout = async (req,res)=>{
    try {
        const id = req.user_id 
        
        const connecte = false
        await userModel.findByIdAndUpdate(id,{
            $set: {connecte}
        })
        
        res.cookie("jwt_token_abir","",{httpOnly:false,maxAge:1})
        res.status(200).json("User successfully logged out")
    } catch (error) {
        res.status(500).json({message:error.message} )
    }
  }




// module.exports.register = async (req, res) => {
//     try {
//       const {
//         nom,
//         email,
//         password,
//         numTel,
//         role, // frontend envoie "Apprenant" ou "Formateur"
//         ville,
//         specialite,
//       } = req.body;
  
//       let formations = req.body.formations;
  
//       // Vérifie si l'utilisateur existe déjà
//       const existingUser = await userModel.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "L'utilisateur existe déjà" });
//       }
  
//       // Hachage mot de passe
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // S'assurer que formations est un tableau
//       if (formations && !Array.isArray(formations)) {
//         formations = [formations];
//       }
  
//       const newUser = new userModel({
//         nom,
//         email,
//         password: hashedPassword,
//         numTel,
//         ville,
//         role, // on transforme la chaîne en tableau
//         formations,
//       });
  
//       if (role === "Formateur") {
//         newUser.specialite = specialite;
//         if (req.file) {
//           newUser.cv = req.file.filename; // ou le chemin complet si tu préfères
//         }
//       }
  
//       await newUser.save();
//       res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
  
//     } catch (error) {
//       console.error("Erreur lors de l’enregistrement :", error);
//       res.status(500).json({ message: "Une erreur est survenue" });
//     }
//   };
module.exports.addUtilisateur = async (req,res) => {
    try {
        const {nom , prenom, email , password , numTel} = req.body;
        
         if (!checkIfUserExists) {
             throw new Error("User not found");
           }
        const user = await userModel.create({
            nom, prenom, email ,password, numTel
        })
        // const user = new userModel({name,age,address,moy});
        //   const adduser = await user.save();
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
