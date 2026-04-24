const mongoose = require("mongoose");

/**
 * Stores the all-time best performance for a specific exercise
 * per user. Only one document per user+exercise combination.
 * Updated authomatically when a new best is detected on workout save.
 */

const prSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    // Best single-set weight
    weight: {
      type: Number,
      default: 0,
    },
    // Reps achieved at that weight
    reps: {
      type: Number,
      default: 0,
    },
    // Total volume for that set (weight x reps) - used as tiebreaker
    volume: {
      type: Number,
      default: 0,
    },
    // Date of the session where this PR was set
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index - one PR record per user per exercise.
prSchema.index({ user: 1, exerciseName: 1 }, { unique: true });

module.exports = mongoose.model("PR", prSchema);
