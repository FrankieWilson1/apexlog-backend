const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");

const {
  getProfile,
  updateProfile,
  updatedPassword,
} = require("../controllers/userController");

// Profile route
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

// Password route
router.route("/password").put(protect, updatedPassword);

module.exports = router;
