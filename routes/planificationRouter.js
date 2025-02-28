var express = require('express');
var router = express.Router();
const planificationController = require('../controllers/planificationController');
/* GET home page. */
router.post('/addPlanification', planificationController.addPlanification);
router.get('/getAllPlanification', planificationController.getAllPlanification);
router.get('/getPlanificationById/:id', planificationController.getPlanificationById);


router.put('/updatePlanification/:id', planificationController.updatePlanification);
router.delete('/deletePlanificationById/:id', planificationController.deletePlanificationById);

module.exports = router;