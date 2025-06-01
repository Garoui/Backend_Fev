const sessionModel = require('../models/sessionSchema');



//  Helper function for generating conference URL
// const generateConferenceUrl = (sessionId) => {
//   Implement your video conference URL generation logic here
//   return `https://your-video-service.com/room/${sessionId}`;
// };


// Get all sessions
// Get all sessions with proper population
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find()
      .populate('formateur', 'prenom nom')
      .populate('apprenants', 'prenom nom');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get sessions accessible to both formateur and apprenant
exports.getAccessibleSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find()
      .populate('formateur', 'prenom nom')
      .populate('apprenants', 'prenom nom');
    
    // Add status to each session
    const sessionsWithStatus = sessions.map(session => ({
      ...session.toObject(),
      status: getSessionStatus(session.start, session.end)
    }));
    
    res.json(sessionsWithStatus);
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
// module.exports.createSession = async (req, res) => {
//   try {
//     // Validate start and end dates
//     if (new Date(req.body.end) <= new Date(req.body.start)) {
//       return res.status(400).json({ 
//         message: 'La date de fin doit être après la date de début' 
//       });
//     }

//     const session = new sessionModel({
//       title: req.body.title,
//       start: req.body.start,
//       end: req.body.end,
//       formateur: req.body.formateur,
//       apprenants: req.body.apprenants || [],
//       type: req.body.type,
//       description: req.body.description,
//       status: 'scheduled'
//     });

//     const newSession = await session.save();
    
//     // Populate the response
//     const populated = await sessionModel.findById(newSession._id)
//       .populate('formateur', 'nom prenom email')
//       .populate('apprenants', 'nom prenom email');

//     res.status(201).json({
//       ...populated.toObject(),
//       formateurName: populated.formateur ? 
//         `${populated.formateur.prenom} ${populated.formateur.nom}` : 'Non assigné',
//       apprenantNames: populated.apprenants.length > 0 ?
//         populated.apprenants.map(a => `${a.prenom} ${a.nom}`).join(', ') :
//         'Aucun'
//     });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };



module.exports.createSession = async (req, res) => {
  try {
    console.log('Session creation request received:', req.body);

    // Validate required fields
    if (!req.body.start || !req.body.end) {
      return res.status(400).json({
        message: 'Start and end dates are required',
        receivedData: req.body
      });
    }

    // Parse and validate dates
    const startDate = new Date(req.body.start);
    const endDate = new Date(req.body.end);
    
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid start date format',
        receivedValue: req.body.start
      });
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        message: 'Invalid end date format',
        receivedValue: req.body.end
      });
    }
if (new Date(req.body.end) <= new Date(req.body.start)) {
  return res.status(400).json({ 
    message: 'End date must be after start date' 
  });
}
    if (endDate <= startDate) {
      return res.status(400).json({ 
        message: 'End date must be after start date',
        dates: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });
    }

    // Process title
    const sessionTitle = req.body.title.trim();
    
    // Check for duplicate titles
    const existingSession = await sessionModel.findOne({ 
      title: sessionTitle 
    });
    
    if (existingSession) {
      return res.status(400).json({
        error: 'DUPLICATE_TITLE',
        message: "A session with this title already exists"
      });
    }

    // Create new session
    const newSessionData = {
      title: sessionTitle,
      start: startDate,
      end: endDate,
      formateur: req.body.formateur,
      apprenants: req.body.apprenants || [],
      type: req.body.type,
      description: req.body.description,
      status: 'scheduled'
    };

    const savedSession = await sessionModel.create(newSessionData);
    
    // Populate and return the created session
    const populatedSession = await sessionModel.findById(savedSession._id)
      .populate('formateur', 'nom prenom email')
      .populate('apprenants', 'nom prenom email');

    res.status(201).json({
      session: populatedSession.toObject(),
      formateurName: populatedSession.formateur ? 
        `${populatedSession.formateur.prenom} ${populatedSession.formateur.nom}` : 'Not assigned',
      apprenantNames: populatedSession.apprenants.length > 0 ?
        populatedSession.apprenants.map(a => `${a.prenom} ${a.nom}`).join(', ') :
        'None'
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(400).json({
      message: error.message,
      errors: error.errors
    });
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
    const session = await sessionModel.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const conferenceUrl = session.generateConferenceUrl();
    res.json({ url: conferenceUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// controllers/sessionController.js
// module.exports.getApprenantSessions = async (req, res) => {
//   try {
//     const apprenantId = req.params.apprenantId;
    
//     // Verify the requesting user has access to these sessions
//     if (req.user.id !== apprenantId && req.user.role !== 'Admin') {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     const sessions = await sessionModel.find({
//       apprenants: apprenantId,
//       status: { $ne: 'cancelled' }
//     })
//     .populate('formateur', 'nom prenom email')
//     .sort('start')
//     .lean();

//     // Format response
//     const formattedSessions = sessions.map(session => ({
//       _id: session._id,
//       courseTitle: session.title,
//       instructorName: session.formateur 
//         ? `${session.formateur.prenom} ${session.formateur.nom}`
//         : 'TBD',
//       startTime: session.start,
//       endTime: session.end,
//       durationMinutes: Math.round((session.end - session.start) / (1000 * 60)),
//       conferenceUrl: session.conferenceUrl,
//       status: session.status
//     }));

//     res.json(formattedSessions);
//   } catch (error) {
// console.error('Error in getApprenantSessions:', error.message, req.params);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };



// Ajoutez cette méthode
module.exports.getSessionsWithStatus = async (sessionId) => {
  const session = await sessionModel.findById(sessionId);
  const now = new Date();
  
  if (session.start <= now && session.end >= now) {
    return 'ONGOING';
  } else if (session.end < now) {
    return 'COMPLETED';
  }
  return 'UPCOMING';
};

// Modifiez la méthode getApprenantSessions
// sessionController.js



module.exports.getApprenantSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find({
      apprenants: req.user._id
    })
    .populate('formateur', 'prenom nom')
    .populate('apprenants', 'prenom nom')
    .lean();

    // Add status to each session
    const sessionsWithStatus = sessions.map(session => ({
      ...session,
      status: getSessionStatus(session.start, session.end)
    }));

    res.json(sessionsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

module.exports.getFormateurSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find({
      formateur: req.user._id
    })
    .populate('formateur', 'prenom nom')
    .populate('apprenants', 'prenom nom')
    .lean();

    // Add status to each session
    const sessionsWithStatus = sessions.map(session => ({
      ...session,
      status: getSessionStatus(session.start, session.end)
    }));

    res.json(sessionsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};


// Dans sessionController.js
module.exports.generateJitsiToken = async (req, res) => {
  const { sessionId, userId } = req.params;
  
  // Vérifiez que l'utilisateur a bien accès à cette session
  const session = await sessionModel.findOne({
    _id: sessionId,
    $or: [
      { formateur: userId },
      { apprenants: userId }
    ]
  });

  if (!session) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }

  // Générer un token JWT temporaire pour Jitsi
  const token = jwt.sign(
    { room: session.jitsiRoom, userId },
    process.env.JITSI_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, roomName: session.jitsiRoom });
};
// Dans sessionController.js - Mettre à jour getFormateurSessions
// module.exports.getFormateurSessions = async (req, res) => {
//   try {
//     const sessions = await sessionModel.find({ formateur: req.user.id })
//       .populate('apprenants', 'nom prenom')
//       .lean();
    
//     const now = new Date();
//     const enhancedSessions = sessions.map(session => ({
//       ...session,
//       status: session.start <= now && session.end >= now ? 'ONGOING' : 
//              session.end < now ? 'COMPLETED' : 'UPCOMING',
//       canJoin: session.start <= now && session.end >= now
//     }));

//     res.json(enhancedSessions);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }; 


// Example status calculation function
// In sessionController.js
exports.getSessionStatus = async (req, res) => {
  try {
    const session = await sessionModel.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const now = new Date();
    let status;
    
    if (now < session.start) {
      status = 'UPCOMING';
    } else if (now >= session.start && now <= session.end) {
      status = 'ONGOING';
    } else {
      status = 'COMPLETED';
    }

    res.json({ 
      status,
      canJoin: status === 'ONGOING',
      jitsiRoom: session.jitsiRoom
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In sessionController.js
exports.validateSessionAccess = async (req, res, next) => {
  const session = await sessionModel.findById(req.params.sessionId)
    .populate('formateur apprenants');
  
  if (!session) return res.status(404).json({ message: 'Session not found' });
  
  const isFormateur = req.user._id.equals(session.formateur._id);
  const isApprenant = session.apprenants.some(a => a._id.equals(req.user._id));
  
  if (!isFormateur && !isApprenant) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  req.sessionData = session;
  next();
};