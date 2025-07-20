const axios = require("axios");

const hms = axios.create({
    baseURL: "https://api.100ms.live/v2", // 100ms API base URL
    headers: {
        Authorization: `Bearer ${process.env.HMS_MANAGEMENT_TOKEN}`, // Replace with your 100ms Management Token
        "Content-Type": "application/json",
    },
});

module.exports = hms;
