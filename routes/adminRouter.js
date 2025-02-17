var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');



router.post('/addUserAdmin',adminController.addUserAdmin);

router.get('/getAllAdmins',adminController.getAllAdmins);

router.get('/getAdminById/:id',adminController.getAdminById);

router.put('/updateAdminById/:id',adminController.updateAdminById);

router.delete('/deleteAdminById/:id',adminController.deleteAdminById);




module.exports = router;