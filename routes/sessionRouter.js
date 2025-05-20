var express = require('express');
var router = express.Router();
const sessionController = require('../controllers/sessionController');
const {requireAuthUser} = require('../middlewares/authMiddleware');

//const liveSessionController = require('../controllers/liveSessionController');
/* GET home page. */
//router.post('/createLiveSession', liveSessionController.createLiveSession);
//router.get('/getSessionsByCourse', liveSessionController.getSessionsByCourse);
// router.get('/getSessionById/:id', liveSessionController.getSessionById);


// router.put('/updateSession/:id', liveSessionController.updateSession);
// router.delete('/deleteSessionById/:id', liveSessionController.deleteSessionById);

router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSession);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);
router.post('/:id/start-conference', sessionController.startVideoConference);

// Add this route
router.get('/formateur/sessions', requireAuthUser, sessionController.getFormateurSessions);
router.get('/apprenant/:apprenantId/sessions', requireAuthUser, sessionController.getApprenantSessions);

module.exports = router;