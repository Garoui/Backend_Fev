var express = require('express');
var router = express.Router();
const formateurController = require('../controllers/formateurController');



router.post('/addUserFormateur',formateurController.addUserFormateur);

router.get('/getAllFormateurs',formateurController.getAllFormateurs);

router.get('/getFormateursById/:id',formateurController.getFormateursById);

router.put('/updateFormateurById/:id',formateurController.updateFormateurById);

router.delete('/deleteFormateurById/:id',formateurController.deleteFormateurById);




module.exports = router;