// models/Meeting.js
// Mongoose model for storing metadata about Daily meetings and their recordings

const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate room names
    },
    //   createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User", // Link to user who created the room (use it later im not gonna use it)
    //   },
    createdAt: {
        type: Date,
        default: Date.now, // Auto-set creation time
    },
    roomId: {
        type: String
    },
    recordingUrl: {
        type: String, // URL to the recording asset from Daily
    },
    duration: {
        type: Number, // Duration of the meeting recording (in seconds)
    },
    participants: {
        type: Number, // Count of participants from recording metadata
    },
});

// Export as a model for external use
module.exports = mongoose.model("Meeting", meetingSchema);
