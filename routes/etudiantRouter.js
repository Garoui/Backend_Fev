var express = require('express');
var router = express.Router();
const etudiantController = require('../controllers/etudiantController');



router.post('/addUserEtudiant',etudiantController.addUserEtudiant);

router.get('/getAllEtudiant',etudiantController.getAllEtudiant);

router.get('/getEtudiantById/:id',etudiantController.getEtudiantById);

router.put('/updateEtudiantById/:id',etudiantController.updateEtudiantById);

router.delete('/deleteEtudiantById/:id',etudiantController.deleteEtudiantById);




module.exports = router;