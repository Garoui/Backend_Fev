const liveSessionModel = require('../models/liveSessionSchema');



module.exports.createLiveSession = async (req, res) => {
    try {
      const session = await liveSessionModel.create(req.body);
      res.status(201).json(session);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  
  module.exports.getSessionsByCourse = async (req, res) => {
    try {
      const sessions = await liveSessionModel.find({ cours: req.params.courseId });
      res.json(sessions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  