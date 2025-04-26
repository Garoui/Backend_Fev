
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


module.exports.addUser = async (req, res) => {
    try {
        const { nom, email, password, role, specialite, cv } = req.body;

        const newUser = new userModel({
            nom,
            email,
            password,
            role,
            ville,
            specialite: role === "formateur" ? specialite : undefined,
            cv: role === "formateur" ? cv : undefined,
            formations: formations || [] // Add this line

        });

        const addUser = await newUser.save();
        res.status(200).json({ addUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addUserAdminWithImg = async(req,res) => {
    try {
        const {nom , prenom , email , motdepasse } = req.body;
        const roleAdmin = 'Admin'
        const {filename}  = req.file


        const user = await userModel.create({
        nom,prenom,email ,motdepasse ,role : roleAdmin ,image : filename
        })

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports.addUserAdmin = async(req,res) => {
    try {
        const {nom , prenom , email , motdepasse } = req.body;
        const roleAdmin = 'Admin'
        const user = await userModel.create({
        nom,prenom,email ,motdepasse ,role : roleAdmin
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
         res.status(200).json({user,token})
     } catch (error) {
         res.status(500).json({message: error.message});
     }
 }
// module.exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log("Tentative de login avec :", email, password);

//         const user = await userModel.login(email, password);
//         console.log("Utilisateur trouvé :", user);

//         const token = createToken(user._id);
//         res.cookie("jwt_token_abir", token, { httpOnly: false, maxAge: maxTime * 1000 });
//         res.status(200).json({ user });

//     } catch (error) {
//         console.error("Erreur dans login backend :", error.message);
//         res.status(500).json({ message: error.message });
//     }
// };
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
      const { email, motdepasse, nom } = req.body;
  
      // Check if user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur existe déjà.' });
      }
  
      // Create new user
      const newUser = await userModel.create({ email, motdepasse, nom });
  
      // Generate token
      const token = createToken(newUser._id);
  
      // Set cookie
      res.cookie("jwt_token_abir", token, { httpOnly: false, maxAge: maxTime * 1000 });
  
      // Return user
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports.logout= async (req,res) => {
    try {
        
        
        res.cookie("jwt_token_abir","", {httpOnly:false,maxAge:1})
        res.status(200).json("logged")
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



// module.exports.register = async (req, res) => {
//     try {
//       const { nom, email, password, role, ville, formations } = req.body;
      
//       const user = new User({
//         nom,
//         email,
//         password: await bcrypt.hash(password, 10),
//         role,
//         ville,
//         formations
//       });
  
//       await user.save();
//       res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   };
module.exports.register = async (req, res) => {
    try {
        
      const { email, password, roles, ville, formations, cv, specialite } = req.body;
  
      // Vérifie si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
      }
  
      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Préparer les rôles (par défaut étudiant)
      const assignedRoles = roles && roles.length > 0 ? roles : ['etudiant'];
  
      // Construire le nouvel utilisateur
      const newUser = new User({
        email,
        password: hashedPassword,
        roles: assignedRoles,
      });
  
      // Si formateur, ajouter les champs spécifiques
      if (assignedRoles.includes('formateur')) {
        newUser.cv = cv;
        newUser.specialite = specialite;
        newUser.formations = formations;
        newUser.ville = ville;
      }
  
      // Si étudiant, ajouter ville et formations
      if (assignedRoles.includes('etudiant')) {
        newUser.formations = formations;
        newUser.ville = ville;
      }
  
      // Sauvegarder l'utilisateur
      await newUser.save();
  
      res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  
    } catch (error) {
      console.error('Erreur lors de l’enregistrement :', error);
      res.status(500).json({ message: 'Une erreur est survenue' });
    }
  };