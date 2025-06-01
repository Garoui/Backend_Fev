const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose; 

const sessionSchema = new mongoose.Schema({
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
  required: true
},
end: {
  type: Date,
  required: true
},
 status: {
  type: String,
  enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'SCHEDULED'],
  default: 'UPCOMING'
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
  apprenants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    validate: {
      validator: function(v) {
        return v.length <= 20;
      },
      message: 'Une session ne peut pas avoir plus de 20 apprenants'
    }
  },
  type: {
    type: String,
    enum: {
      values: ['online', 'presentiel'],
      message: 'Le type de session doit être soit "online" ou "presentiel"'
    },
    default: 'online'
  },
 jitsiRoom: {
  type: String,
  required: true,
  default: function() {
    return `sesame-${this._id}-${crypto.randomBytes(4).toString('hex')}`;
  },
  validate: {
    validator: function(v) {
      return /^[a-zA-Z0-9-_]+$/.test(v);
    },
    message: 'Invalid Jitsi room name format'
  }
},
  conferenceUrl: {
    type: String,
    select: false
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

// Indexes
sessionSchema.index({ start: 1 });
sessionSchema.index({ formateur: 1 });
sessionSchema.index({ apprenants: 1 });
sessionSchema.index({ status: 1 });

// Virtuals
sessionSchema.virtual('duration').get(function() {
  return (this.end - this.start) / (1000 * 60);
});

// Hooks
sessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  const now = new Date();
  if (this.start <= now && this.end >= now) {
    this.status = 'ongoing';
  } else if (this.end < now) {
    this.status = 'completed';
  }
  next();
});

sessionSchema.pre('save', async function(next) {
  if (this.isNew && this.type === 'online') {
    this.conferenceUrl = generateConferenceUrl(this._id);
  }
  next();
});

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

function generateConferenceUrl(sessionId) {
  // Simple implementation - you can customize this as needed
  return `https://meet.jit.si/sesame-${sessionId}`;
};

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;