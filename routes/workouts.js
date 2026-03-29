const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  deleteWorkout,
  deleteAllWorkouts,
} = require("../controllers/workoutController");

router.route("/").get(protect, getWorkouts).post(protect, createWorkout);

router.route("/all").delete(protect, deleteAllWorkouts);

router
  .route("/:id")
  .get(protect, getWorkoutById)
  .delete(protect, deleteWorkout);

module.exports = router;
