var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.post('/addUserEtudiant',userController.addUserEtudiant);
router.post('/addUserAdmin',userController.addUserAdmin);
router.get('/getAllUsers',userController.getAllUsers);
router.get('/getUsersById/:id',userController.getUsersById);

module.exports = router;
