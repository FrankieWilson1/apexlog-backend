const PR = require("../models/PR");

/**
 * Detects new PRs from a completed workout and saves them.
 * Called internally from workoutController after saving a workout.
 * Returns an array of exercise names where a new PR was set.
 *
 * @param {string} userId - The authenticated user's ID
 * @param {Array}  exercises - The exercises array from the completed workout
 * @param {string} date - The workout date string
 * @returns {Promise<string[]>} Array of exercise names with new PRs
 */
const detectAndSavePRs = async (userId, exercises, date) => {
  const newPRs = [];

  for (const exercise of exercises) {
    // Only look at completed sets with valid weight and reps
    const completedSets = exercise.sets.filter(
      (s) => s.isCompleted && Number(s.weight) > 0 && Number(s.reps) > 0,
    );

    if (completedSets.length === 0) continue;

    // Find the best set from this session (highest volume)
    const bestSet = completedSets.reduce((best, set) => {
      const volume = Number(set.weight) * Number(set.reps);
      const bestVolume = Number(best.weight) * Number(best.reps);
      return volume > bestVolume ? set : best;
    });

    const sessionVolume = Number(bestSet.weight) * Number(bestSet.reps);

    // Find existing PR for this exercise
    const existingPR = await PR.findOne({
      user: userId,
      exerciseName: exercise.name,
    });

    const isNewPR = !existingPR || sessionVolume > existingPR.volume;

    if (isNewPR) {
      // Upsert — create or update the PR record
      await PR.findOneAndUpdate(
        { user: userId, exerciseName: exercise.name },
        {
          weight: Number(bestSet.weight),
          reps: Number(bestSet.reps),
          volume: sessionVolume,
          date,
        },
        { upsert: true, new: true },
      );

      newPRs.push(exercise.name);
    }
  }

  return newPRs;
};

/**
 * @route  GET /api/prs
 * @access Private
 * @desc   Get all PRs for the authenticated user
 */
const getPRs = async (req, res) => {
  try {
    const prs = await PR.find({ user: req.user._id }).sort({
      exerciseName: 1,
    });
    res.json(prs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route  GET /api/prs/:exerciseName
 * @access Private
 * @desc   Get PR history for a specific exercise
 */
const getPRByExercise = async (req, res) => {
  try {
    const pr = await PR.findOne({
      user: req.user._id,
      exerciseName: req.params.exerciseName,
    });

    if (!pr) {
      return res.status(404).json({ message: "No PR found for this exercise" });
    }

    res.json(pr);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { detectAndSavePRs, getPRs, getPRByExercise };
