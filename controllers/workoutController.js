const Workout = require("../models/Workout");

//________________________________________________
// @route GET /api/workouts
// @access Private
// @desc Get all workouts
const getWorkouts = async (req, res) => {
  try {
    // req.user._id comes from the middleware that authenticates the user and adds the user object to the request
    const workouts = await Workout.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//________________________________________________
// @route POST /api/workouts
// @access Private
// @desc Create a new workout
const createWorkout = async (req, res) => {
  try {
    const { title, date, volumeKg, durationMinutes, exercises } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const workout = await Workout.create({
      user: req.user._id,
      title,
      date,
      volumeKg,
      durationMinutes,
      exercises,
    });

    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

//________________________________________________
// @route GET /api/workouts/:id
// @access Private
// @desc Get a single workout by ID
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // Make sure the workout belongs to the requesting user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//________________________________________________
// @route DELETE /api/workouts/:id
// @access Private
// @desc Delete a workout by ID
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    // Make sure the workout belongs to the requesting user
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Workout not found" });
    }

    await workout.deleteOne();
    res.json({ message: "Workout removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

//_______________________________________________
// @route DELETE /api/workouts/all
// @access Private
// @desc Deletes all workouts fro the logged in user
const deleteAllWorkouts = async (req, res) => {
  try {
    await Workout.deleteMany({ user: req.user._id });
    res.json({ message: "All workouts cleared" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWorkouts,
  createWorkout,
  getWorkoutById,
  deleteWorkout,
  deleteAllWorkouts,
};
