var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require ('../middlewares/uploadFile');
const etudiantController = require('../controllers/etudiantController');
const formateurController = require('../controllers/formateurController');
const adminController = require('../controllers/adminController');
const {requireAuthUser} = require('../middlewares/authMiddleware');

router.post('/login',userController.login);
router.post('/logout',userController.logout);
router.post('/signin',userController.signin);

//admin
router.post('/addUserAdmin',adminController.addUserAdmin);
router.get('/getAllAdmins',adminController.getAllAdmins);
router.get('/getAdminById/:id',adminController.getAdminById);
router.put('/updateAdminById/:id',adminController.updateAdminById);
router.delete('/deleteAdminById/:id',adminController.deleteAdminById);


// /* GET users listing. */
 router.post('/addUser',userController.addUser);
//router.post('/addUserAdmin',userController.addUserAdmin);
 router.get('/getAllUsers',userController.getAllUsers);
 router.get('/getUsersById/:id',userController.getUsersById);
 router.get('/searchUserByUsername',userController.searchUserByUsername)
 router.put('/updateuserById/:id',userController.updateuserById);
 router.post('/addUserAdminWithImg',upload.single("image"),userController.addUserAdminWithImg);
 




 //formateur

 router.post('/addUserFormateur',formateurController.addUserFormateur);
 router.get('/getAllFormateurs',formateurController.getFormateurs);
 router.get('/getFormateursById/:id',formateurController.getFormateursById);
 router.put('/updateFormateurById/:id',formateurController.updateFormateurById);
 router.delete('/deleteFormateurById/:id',formateurController.deleteFormateurById);
 // etudiant 

 router.post('/addUserEtudiant',etudiantController.addUserEtudiant);
 router.get('/getAllEtudiant',etudiantController.getAllEtudiant);

 router.get('/getAllEtudiantByRole/:roleEtudiant',etudiantController.getAllEtudiant);
 router.get('/getEtudiantById/:id',etudiantController.getEtudiantById);
 router.put('/updateEtudiantById/:id',etudiantController.updateEtudiantById);
 router.delete('/deleteEtudiantById/:id',etudiantController.deleteEtudiantById);


module.exports = router;
