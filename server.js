const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load environment variables before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

//____ Secuirity Middleware ____
// Helmet secures Express app by setting various HTTP headers
app.use(helmet());

// Rate limter specific to authentication routes to prevent
// hackers from spamming thousands of password guesses
const authLimiter = rateLimit({
  windowsMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

// ___ Standard Middleware___
app.use(cors());
app.use(express.json());

// __Routes__
// authLimiter applied only to the auth routes
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/workouts", require("./routes/workouts"));

// Health check route - confirms the server is running
app.get("/", (req, res) => {
  res.json({
    message: "ApexLog API is running",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
