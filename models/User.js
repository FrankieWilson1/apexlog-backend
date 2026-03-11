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
            default: "Build Muscle",
        },
        height: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving (Runs only when password is modified)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compares a plain password against the stored hash
userSchema.method.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
