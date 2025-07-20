// routes/meetingRoutes.js
// Routes for creating, retrieving, and handling meeting events

const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

// @route   POST /api/meetings/create
// @desc    Create a new room
router.post("/create", meetingController.createRoom);

// @route   POST /api/meetings/token
// @desc    Generate JWT for joining a 100ms room
router.post("/token", meetingController.generateToken);

// @route   GET /api/meetings/:name
// @desc    Fetch room info
router.get("/:name", meetingController.getRoom);

// @route   POST /api/meetings/webhook
// @desc    Webhook endpoint for meeting events
router.post("/webhook", meetingController.webhook);

module.exports = router;
