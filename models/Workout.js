const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  weight: { type: mongoose.Schema.Types.Mixed, default: "" },
  reps: { type: mongoose.Schema.Types.Mixed, default: "" },
  isCompleted: { type: Boolean, default: false },
  previousStr: { type: String, default: "-" },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroups: [{ type: String }],
  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    date: { type: String, required: true },
    volumeKg: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0 },
    exercises: [exerciseSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Workout", workoutSchema);
