# 100ms Meeting Service

This backend service manages 100ms video meeting rooms, with recording support and webhook handling for recording events.

---

## 📁 Structure

- `config/onehundredms.js`: 100ms configuration and token handling
- `models/Meeting.js`: Mongoose model for storing meeting metadata update it as u want like adding participants array , formatter id for better logic
- `controllers/meetingController.js`: Room creation, retrieval, webhook processing
- `routes/meetingRoute.js`: REST API routes for meetings
- `app.js`: Registers the meeting router

---

## 🚀 Features

- Create 100ms meeting rooms with recording enabled
- Auto-start recording when a host joins
- Handle 100ms webhook events (e.g., `room.recording.success`)
- Store metadata and recording URLs in MongoDB

---

## ⚙️ Environment Variables

Create a `.env` file in your project root with:

```env
MONGO_URI=your_mongodb_uri
HMS_MANAGEMENT_TOKEN=your_generated_management_token
HMS_TEMPLATE_ID=your_template_id
HMS_SECRET=your_hms_secret
HMS_ACCESS_KEY=your_hms_access_key
PORT=5000
ORIGIN_FRONT=http://localhost:3000
