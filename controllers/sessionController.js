const sessionModel = require('../models/sessionSchema');
const mongoose = require('mongoose'); 
// Helper function for generating conference URL
const generateConferenceUrl = (sessionId) => {
  // Implement your video conference URL generation logic here
  return `https://your-video-service.com/room/${sessionId}`;
};


// Get all sessions
// Get all sessions with proper population
module.exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find()
      .populate('formateur', 'nom prenom email')
      .populate('apprenants', 'nom prenom email');

    const formatted = sessions.map(session => ({
      ...session.toObject(),
      formateurName: session.formateur ? 
        `${session.formateur.prenom} ${session.formateur.nom}` : 'Non assigné',
      apprenantNames: session.apprenants.length > 0 ?
        session.apprenants.map(a => `${a.prenom} ${a.nom}`).join(', ') :
        'Aucun'
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single session
module.exports.getSession = async (req, res) => {
  try {
    const session = await sessionModel.findById(req.params.id)
      .populate('formateur')
      .populate('apprenants');
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create session
module.exports.createSession = async (req, res) => {
  try {
    // Validate start and end dates
    if (new Date(req.body.end) <= new Date(req.body.start)) {
      return res.status(400).json({ 
        message: 'La date de fin doit être après la date de début' 
      });
    }

    const session = new sessionModel({
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      formateur: req.body.formateur,
      apprenants: req.body.apprenants || [],
      type: req.body.type,
      description: req.body.description,
      status: 'scheduled'
    });

    const newSession = await session.save();
    
    // Populate the response
    const populated = await sessionModel.findById(newSession._id)
      .populate('formateur', 'nom prenom email')
      .populate('apprenants', 'nom prenom email');

    res.status(201).json({
      ...populated.toObject(),
      formateurName: populated.formateur ? 
        `${populated.formateur.prenom} ${populated.formateur.nom}` : 'Non assigné',
      apprenantNames: populated.apprenants.length > 0 ?
        populated.apprenants.map(a => `${a.prenom} ${a.nom}`).join(', ') :
        'Aucun'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update session
module.exports.updateSession = async (req, res) => {
  try {
    const updatedSession = await sessionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSession) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }
    res.json(updatedSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete session
module.exports.deleteSession = async (req, res) => {
  try {
    const session = await sessionModel.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }
    res.json({ message: 'Session supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Start video conference
module.exports.startVideoConference = async (req, res) => {
  try {
    const conferenceUrl = generateConferenceUrl(req.params.id);
    res.json({ 
      success: true,
      url: conferenceUrl,
      message: 'URL de conférence générée'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};




// controllers/sessionController.js
module.exports.getApprenantSessions = async (req, res) => {
  try {
    const apprenantId = req.params.apprenantId;
    console.log('User making request:', req.user);
console.log('Requested apprenantId:', apprenantId);
    // Verify the requesting user has access to these sessions
    if (req.user.id !== apprenantId && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const sessions = await sessionModel.find({
      apprenants: apprenantId,
      status: { $ne: 'cancelled' }
    })
    .populate('formateur', 'nom prenom email')
    .sort('start')
    .lean();

    // Format response
    const formattedSessions = sessions.map(session => ({
      _id: session._id,
      courseTitle: session.title,
      instructorName: session.formateur 
        ? `${session.formateur.prenom} ${session.formateur.nom}`
        : 'TBD',
      startTime: session.start,
      endTime: session.end,
      durationMinutes: Math.round((session.end - session.start) / (1000 * 60)),
      conferenceUrl: session.conferenceUrl,
      status: session.status
    }));

    res.json(formattedSessions);
  } catch (error) {
console.error('Error in getApprenantSessions:', error.message, req.params);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports.getFormateurSessions = async (req, res) => {
  try {
    const formateurId = req.user.id;

    const sessions = await sessionModel.find({ formateur: formateurId })
      .populate('apprenants', 'nom prenom')
      .sort('start');

    res.json(sessions);
  } catch (error) {
    console.error('Erreur getFormateurSessions:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};