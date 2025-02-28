var express = require('express');
var router = express.Router();
const sessionController = require('../controllers/sessionController');
/* GET home page. */
router.post('/addSession', sessionController.addSession);
router.get('/getAllSession', sessionController.getAllSession);
router.get('/getSessionById/:id', sessionController.getSessionById);


router.put('/updateSession/:id', sessionController.updateSession);
router.delete('/deleteSessionById/:id', sessionController.deleteSessionById);

module.exports = router;