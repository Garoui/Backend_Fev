var express = require('express');
var router = express.Router();
const sessionController = require('../controllers/sessionController');
const {requireAuthUser, checkAdmin} = require('../middlewares/authMiddleware');

//const liveSessionController = require('../controllers/liveSessionController');
/* GET home page. */
//router.post('/createLiveSession', liveSessionController.createLiveSession);
//router.get('/getSessionsByCourse', liveSessionController.getSessionsByCourse);
// router.get('/getSessionById/:id', liveSessionController.getSessionById);


// router.put('/updateSession/:id', liveSessionController.updateSession);
// router.delete('/deleteSessionById/:id', liveSessionController.deleteSessionById);

router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSession);
router.post('/createSession', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);
router.post('/:id/start-conference', sessionController.startVideoConference);

// Add this route
router.get('/getFormateurSessions', requireAuthUser, sessionController.getFormateurSessions);
router.get('/getApprenantSessions', requireAuthUser, sessionController.getApprenantSessions);
// In sessionRouter.js
router.get('/status/:userId/:role', sessionController.getSessionsWithStatus);

// Update routes in sessionRouter.js
 router.post('/', requireAuthUser, checkAdmin, sessionController.createSession);
router.put('/:id', requireAuthUser, checkAdmin, sessionController.updateSession);
// In your routes
router.get('/', requireAuthUser, sessionController.validateSessionAccess,sessionController.generateJitsiToken);
module.exports = router;