

const jwt = require("jsonwebtoken");
const userModel = require("../models/userSchema");

const requireAuthUser = async (req, res, next) => {
  const token = req.cookies.jwt_token_abir;
  console.log("Token reçu :", token);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log("Erreur lors de la vérification du token :", err.message);
        req.session.user = null;
        req.user = null;
        return res.status(401).json({ message: "Token invalide" });
      } else {
        try {
          const user = await userModel.findById(decodedToken.id);
          if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
          }
          req.session.user = user;
          req.user = user;
          next();
        } catch (e) {
          return res.status(500).json({ message: "Erreur serveur" });
        }
      }
    });
  } else {
    req.session.user = null;
    req.user = null;
    return res.status(401).json({ message: "Aucun token fourni" });
  }
};

module.exports = { requireAuthUser };

// const jwt = require("jsonwebtoken");

// const userModel = require("../models/userSchema");

// const requireAuthUser = (req, res, next) => {
//    const token = req.cookies.jwt_token_abir;
//    console.log("token", token); 
//    //token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODg5OWI0ZDViODAzM2UxY2M1MTNiMyIsImlhdCI6MTY4
//    // Njc1MzQ4NCwiZXhwIjoxNjg2NzYwNjg0fQ.KPnsNPjL0PS3oyZ5l3mMC9GUc0ymgheVr-FYt_31pN0
//   //const authHeader = req.headers.authorization;
//   //const token = authHeader && authHeader.split(" ")[1];
//   // console.log("token", token);
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
//       if (err) {
//         console.log("il ya une erreur au niveau du token", err.message);
//         req.session.user = null;
//         req.user = user;
//         res.json("/Problem_token");
//       } else {
//         console.log("Token verified, user:", decodedToken);
//         req.session.user = await userModel.findById(decodedToken.id);//session feha user
//         next();
//       }
//     });
//   } else {
//     req.session.user = null;//session null
//     res.json("/pas_de_token");
//   }
// };
// module.exports = { requireAuthUser };