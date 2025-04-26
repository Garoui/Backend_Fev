var express = require('express');
var router = express.Router();
const liveSessionController = require('../controllers/liveSessionController');
/* GET home page. */
router.post('/createLiveSession', liveSessionController.createLiveSession);
router.get('/getSessionsByCourse', liveSessionController.getSessionsByCourse);
// router.get('/getSessionById/:id', liveSessionController.getSessionById);


// router.put('/updateSession/:id', liveSessionController.updateSession);
// router.delete('/deleteSessionById/:id', liveSessionController.deleteSessionById);

module.exports = router;