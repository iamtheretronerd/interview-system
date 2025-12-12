const { getKnowledgebase } = require("../services/knowledgebaseService");
const { createApplicant } = require("../services/applicantService");
const { chat, extractDecision } = require("../services/llmService");
const { AppError, asyncHandler } = require("../middleware/errorHandler");

const sessions = new Map();

const startInterview = asyncHandler(async (req, res) => {
  const kb = await getKnowledgebase();

  if (!kb) {
    throw new AppError(
      "No knowledgebase uploaded. Please upload a PDF first.",
      400,
    );
  }

  const sessionId = Date.now().toString();

  sessions.set(sessionId, {
    transcript: [],
    knowledgebase: kb.content,
    createdAt: new Date(),
  });

  const greeting = await chat([], kb.content);

  const session = sessions.get(sessionId);
  session.transcript.push({ role: "assistant", message: greeting });

  res.status(200).json({
    success: true,
    sessionId,
    message: greeting,
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { sessionId, message } = req.body;

  const session = sessions.get(sessionId);

  if (!session) {
    throw new AppError("Session not found or expired", 404);
  }

  session.transcript.push({ role: "user", message });

  const llmResponse = await chat(session.transcript, session.knowledgebase);

  const decision = extractDecision(llmResponse);

  if (decision.completed) {
    session.transcript.push({
      role: "assistant",
      message: decision.displayMessage,
    });

    const applicant = await createApplicant({
      studentName: decision.studentName,
      program: decision.program,
      outcome: decision.outcome,
      ruleSummary: decision.ruleSummary,
      transcript: session.transcript,
    });

    sessions.delete(sessionId);

    return res.status(200).json({
      success: true,
      message: decision.displayMessage,
      completed: true,
      outcome: decision.outcome,
      applicantId: applicant._id,
    });
  }

  session.transcript.push({ role: "assistant", message: llmResponse });

  res.status(200).json({
    success: true,
    message: llmResponse,
    completed: false,
  });
});

const endInterview = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  const session = sessions.get(sessionId);

  if (!session) {
    throw new AppError("Session not found or expired", 404);
  }

  const applicant = await createApplicant({
    studentName: "Anonymous",
    program: "Unknown",
    outcome: "Incomplete",
    ruleSummary: "Interview ended early",
    transcript: session.transcript,
  });

  sessions.delete(sessionId);

  res.status(200).json({
    success: true,
    message: "Interview ended",
    applicantId: applicant._id,
  });
});

const getSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);

  if (!session) {
    throw new AppError("Session not found or expired", 404);
  }

  res.status(200).json({
    success: true,
    transcript: session.transcript,
    createdAt: session.createdAt,
  });
});

module.exports = {
  startInterview,
  sendMessage,
  endInterview,
  getSession,
};
