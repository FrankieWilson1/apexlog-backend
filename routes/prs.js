const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const { getPRs, getPRByExercise } = require("../controllers/prController");

router.get("/", protect, getPRs);
router.get("/:exerciseName", protect, getPRByExercise);

module.exports = router;
