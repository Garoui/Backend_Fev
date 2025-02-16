var express = require('express');
var router = express.Router();
const formationController = require('../controllers/formationController');
/* GET home page. */
router.get('/getAllFormation', formationController.getAllFormation);
router.get('/getFormationById/:id', formationController.getFormationById);
router.post('/addFormation', formationController.addFormation);

router.put('/updateFormation/:id', formationController.updateFormation);
router.delete('/deleteFormationById/:id', formationController.deleteFormationById);

module.exports = router;