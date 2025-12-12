const express = require("express");
const { validate } = require("../middleware/validators");
const {
  startInterview,
  sendMessage,
  endInterview,
  getSession,
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/start", startInterview);

router.post("/message", validate("sendMessage"), sendMessage);

router.post("/end", validate("endInterview"), endInterview);

router.get("/session/:sessionId", getSession);

module.exports = router;
