var express = require('express');
var router = express.Router();
const enregistrementController = require('../controllers/enregistrementController');
/* GET home page. */
router.post('/addEnregistrement', enregistrementController.addEnregistrement);
router.get('/getAllEnregistrement', enregistrementController.getAllEnregistrement);
router.get('/getEnregistrementById/:id', enregistrementController.getEnregistrementById);


router.put('/updateEnregistrement/:id', enregistrementController.updateEnregistrement);
router.delete('/deleteEnregistrementById/:id', enregistrementController.deleteEnregistrementById);

module.exports = router;