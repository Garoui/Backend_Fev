var express = require('express');
var router = express.Router();
const groupchatController = require('../controllers/groupchatController');
/* GET home page. */
router.post('/addGroupChat', groupchatController.addGroupChat);
router.get('/getAllGroupChat', groupchatController.getAllGroupChat);
router.get('/getGroupChatById/:id', groupchatController.getGroupChatById);


router.put('/updateGroupChat/:id', groupchatController.updateGroupChat);
router.delete('/deleteGroupChatById/:id', groupchatController.deleteGroupChatById);

module.exports = router;