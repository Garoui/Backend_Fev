var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require ('../middlewares/uploadFile');
/* GET users listing. */
router.post('/addUserEtudiant',userController.addUserEtudiant);
router.post('/addUserAdmin',userController.addUserAdmin);
router.get('/getAllUsers',userController.getAllUsers);
router.get('/getUsersById/:id',userController.getUsersById);

router.post('/addUserEtudiantWithImg',upload.single("image"),userController.addUserEtudiantWithImg);

module.exports = router;
