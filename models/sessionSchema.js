const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Le titre de la session est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  start: {
    type: Date,
    required: [true, 'La date de début est requise'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'La date de début doit être dans le futur'
    }
  },
  end: {
    type: Date,
    required: [true, 'La date de fin est requise'],
    validate: {
      validator: function(value) {
        return value > this.start;
      },
      message: 'La date de fin doit être après la date de début'
    }
  },
  formateur: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Un formateur doit être assigné'],
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Formateur';
      },
      message: 'L\'utilisateur doit être un formateur'
    }
  },
  apprenants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async function(value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Apprenant';
      },
      message: 'Tous les participants doivent être des apprenants'
    }
  }],
  type: {
    type: String,
    enum: {
      values: ['online', 'presentiel'],
      message: 'Le type de session doit être soit "online" ou "presentiel"'
    },
    default: 'online'
  },
  conferenceUrl: {
    type: String,
    select: false // Hidden by default for security
  },
 status: {
  type: String,
  enum: ['scheduled', 'completed', 'cancelled'],
  default: 'scheduled'
},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for duration (in minutes)
sessionSchema.virtual('duration').get(function() {
  return (this.end - this.start) / (1000 * 60);
});

// Update timestamp on save
sessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Auto-generate conference URL before saving new online sessions
sessionSchema.pre('save', async function(next) {
  if (this.isNew && this.type === 'online') {
    this.conferenceUrl = generateConferenceUrl(this._id);
  }
  next();
});

// Query middleware to populate formateur and apprenants by default
sessionSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'formateur',
    select: 'nom prenom email'
  }).populate({
    path: 'apprenants',
    select: 'nom prenom email'
  });
  next();
});

// Helper function to generate conference URL
function generateConferenceUrl(sessionId) {
  // Implement your actual video conference URL generation logic
  return `https://your-video-service.com/room/${sessionId}`;
}

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
