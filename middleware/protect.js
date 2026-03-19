const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extracts token from "Bearer"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token and decode the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attaches the user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      // passes control to the next function
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed " });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token " });
  }
};

module.exports = protect;
