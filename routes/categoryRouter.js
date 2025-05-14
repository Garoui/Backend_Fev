var express = require('express');
var router = express.Router();
const categoryController = require('../controllers/categorieController');
/* GET home page. */
router.get('/getFormationsGroupedByCategory', categoryController.getFormationsGroupedByCategory);
//router.get('/getAllCategories', categoryController.getAllCategories);
router.post('/addCategory', categoryController.addCategory);
router.get('/getAllCategories', categoryController.getAllCategories);





module.exports = router;