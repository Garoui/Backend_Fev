var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const upload = require ('../middlewares/uploadFile');
const apprenantController = require('../controllers/apprenantController');
const formateurController = require('../controllers/formateurController');
const adminController = require('../controllers/adminController');
const {requireAuthUser} = require('../middlewares/authMiddleware');
const {addUser} = require('../controllers/userController');

router.post('/login',requireAuthUser ,userController.login);
router.post('/logout',userController.logout);
router.post('/signin',userController.signin);

//admin
router.post('/addUserAdmin',adminController.addUserAdmin);
router.get('/getAllAdmins',adminController.getAllAdmins);
router.get('/getAdminById/:id',adminController.getAdminById);
router.put('/updateAdminById/:id',adminController.updateAdminById);
router.delete('/deleteAdminById/:id',adminController.deleteAdminById);

router.post('/addUtilisateur',userController.addUtilisateur);


router.delete('/deleteUsersById/:id',userController.deleteUsersById);


// /* GET users listing. */
router.post('/addUser', upload.single('cv'),userController.addUser);

router.get('/getMyProfile',requireAuthUser,userController.getMyProfile);

//router.post('/addUserAdmin',userController.addUserAdmin);
 router.get('/getAllUsers',userController.getAllUsers);
 
 router.get('/getUsersById/:id',requireAuthUser, userController.getUsersById);
 router.get('/searchUserByUsername',userController.searchUserByUsername)
 router.put('/updateUserById/:id',userController.updateUserById);
 router.post('/addUserAdminWithImg',upload.single("image"),userController.addUserAdminWithImg);
 

 router.put('/updateProfile', requireAuthUser,userController.updateProfile);



 //formateur

 router.post('/addUserFormateur',upload.single('cv'),formateurController.addUserFormateur);
 router.get('/getAllFormateurs',userController.getAllFormateurs);
 router.get('/getFormateursById/:id',formateurController.getFormateursById);
 router.put('/updateFormateurById/:id',formateurController.updateFormateurById);
 router.delete('/deleteFormateurById/:id',formateurController.deleteFormateurById);
 // Apprenant 

 router.post('/addUserApprenant',apprenantController.addUserApprenant);
 router.get('/getAllApprenant',apprenantController.getAllApprenant);

 router.get('/getAllApprenantByRole/:roleApprenant',apprenantController.getAllApprenant);
 router.get('/getApprenantById/:id',apprenantController.getApprenantById);
 router.put('/updateApprenantById/:id',apprenantController.updateApprenantById);
 router.delete('/deleteApprenantById/:id',apprenantController.deleteApprenantById);


module.exports = router;
