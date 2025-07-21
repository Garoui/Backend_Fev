// controllers/meetingController.js
// Logic for managing 100ms meeting creation, retrieval

const hms = require("../config/onehundredms"); // now points to 100ms config
const Meeting = require("../models/Meeting");
const jwt = require("jsonwebtoken");


/**
 * @desc    Create a new 100ms room
 * @route   POST /api/meetings/create
 * @access  Public
 * @body    { name: String } - Room name
 */
exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Room name is required" });

    const response = await hms.post("/rooms", {
      name,
      description: "MVP Room",
      template_id: process.env.HMS_TEMPLATE_ID, // use your 100ms template ID
      region: "eu",
    });

    const room = new Meeting({
      name,
      roomId: response.data.id,
      createdAt: new Date(),
    });

    await room.save();
    res.status(201).json({ room });
  } catch (err) {
    console.error("Room creation error:", err.message);
    res.status(500).json({
      error: "Room creation failed",
      details: err.response?.data || err.message,
    });
  }
};

/**
 * @desc    Generate JWT for joining a 100ms room
 * @route   POST /api/meetings/token
 * @access  Public
 * @body    { roomId: String, userId: String, role: String }
 */
exports.generateToken = async (req, res) => {
  try {
    const { roomId, userId, role } = req.body;

    if (!roomId || !userId || !role) {
      return res.status(400).json({ error: "roomId, userId and role are required" });
    }

    const payload = {
      access_key: process.env.HMS_ACCESS_KEY,
      room_id: roomId,
      user_id: userId,
      role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      jti: `${userId}-${Date.now()}`
    };

    const token = jwt.sign(payload, process.env.HMS_SECRET);
    console.log({token: token})
    res.json({ token });
  } catch (err) {
    console.error("Token generation error:", err.message);
    res.status(500).json({ error: "Token generation failed" });
  }
};

/**
 * @desc    Get 100ms room info by name
 * @route   GET /api/meetings/:name
 * @access  Public
 */
exports.getRoom = async (req, res) => {
  try {
    const { name } = req.params;

    const room = await Meeting.findOne({ name });
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch room", details: err.message });
  }
};

/**
 * @desc    Webhook handler for 100ms events
 * @route   POST /api/meetings/webhook
 * @access  Public (protect with secret token later)
 */
exports.webhook = async (req, res) => {
  const event = req.body?.type;
  const data = req.body?.data;

  if (!event || !data) {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }

  console.log("📩  Webhook event received:", event);

  try {
    switch (event) {
      case "beam.recording.success": {
        const { room_id, location, started_at, stopped_at, recording_info } = data;
        console.log({recordingUrl:location})
        const duration = Math.floor((new Date(stopped_at) - new Date(started_at)) / 1000);
        const participants = recording_info?.participants || 0;

        const meeting = await Meeting.findOneAndUpdate(
          { roomId: room_id },
          {
            recordingUrl: location,
            duration,
            participants,
          },
          { new: true }
        );

        if (!meeting) {
          console.warn(`⚠️ No meeting found for roomId: ${room_id}`);
        } else {
          console.log("✅ Recording updated for room:", room_id);
        }
        break;
      }

      case "room.recording.started":
        console.log(`📹 Recording started for room: ${data.room_id}`);
        break;

      case "room.recording.stopped":
        console.log(`🛑 Recording stopped for room: ${data.room_id}`);
        break;

      default:
        console.log("ℹ️ Unhandled 100ms webhook event:", event);
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("❌ Webhook processing error:", err.message);
    res.status(500).json({ error: "Webhook failed", details: err.message });
  }
};

