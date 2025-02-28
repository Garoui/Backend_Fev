var express = require('express');
var router = express.Router();
const chapitreController = require('../controllers/chapitreController');
/* GET home page. */
router.post('/addChapitre', chapitreController.addChapitre);
router.get('/getAllChapitres', chapitreController.getAllChapitres);
router.get('/getChapitreById/:id', chapitreController.getChapitreById);


router.put('/updateChapitre/:id', chapitreController.updateChapitre);
router.delete('/deleteChapitreById/:id', chapitreController.deleteChapitreById);

module.exports = router;