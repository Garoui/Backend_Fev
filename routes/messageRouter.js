var express = require('express');
var router = express.Router();
const messageController = require('../controllers/messageController');
/* GET home page. */
router.post('/addMessage', messageController.addMessage);
router.get('/getAllMessages', messageController.getAllMessages);
router.get('/getMessageById/:id', messageController.getMessageById);


router.put('/updateMessage/:id', messageController.updateMessage);
router.delete('/deleteMessageById/:id', messageController.deleteMessageById);

module.exports = router;