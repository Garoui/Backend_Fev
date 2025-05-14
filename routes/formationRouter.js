var express = require('express');
var router = express.Router();
const formationController = require('../controllers/formationController');
const {requireAuthUser} = require('../middlewares/authMiddleware');

/* GET home page. */
router.get('/getMyFormation', formationController.getMyFormation);



router.get('/getAllFormation', formationController.getAllFormation);
router.get('/getFormationById/:id', formationController.getFormationById);
router.post('/addFormation', formationController.addFormation);
 
router.get('/getFormationsGroupedByCategory', formationController.getFormationsGroupedByCategory);

router.put('/affect', formationController.affect);
router.put('/desaffect', formationController.desaffect);

router.put('/updateFormation/:id', formationController.updateFormation);
router.delete('/deleteFormationById/:id', formationController.deleteFormationById);



router.get('/getFormationsByCategorieId', formationController.getFormationsByCategorieId);


module.exports = router;