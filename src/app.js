const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Routes
const adminRoutes = require("./routes/adminRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/interview", interviewRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.resolve(__dirname, "..", "frontend", "dist");

  console.log("Serving frontend from:", buildPath);

  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}


// 404 handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
