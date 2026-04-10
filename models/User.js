const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    goal: {
      type: String,
      enum: [
        "Build Muscle",
        "Lose Weight",
        "Improve Endurance",
        "Stay Active",
        "Increase Strength",
      ],
      default: "Build Muscle",
    },
    height: {
      type: String,
      default: "",
    },
    weight: {
      type: String,
      default: "",
    },
    // Tracks User onboarding activities
    hasOnboarded: {
      type: Boolean,
      default: false,
    },
    // Preffered wight unit
    weightUnit: {
      type: String,
      enum: ["kg", "lbs"],
      default: "kg",
    },
    // Notification preferences
    notifications: {
      type: Boolean,
      default: true,
    },
    // Rest timmer duration
    restDuration: {
        type: Number,
        default: 90,    // seconds
        min: 10,
        max: 600,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving (Runs only when password is modified)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compares a plain password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
