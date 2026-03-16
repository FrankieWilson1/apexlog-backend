const User = require("../models/User");
const jwt = require("jsonwebtoken");

// _____________________________________________
// Helper - generates a signed JWT for a user
// _____________________________________________
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

// _______________________________________________
// @route POST /api/auth/register
// @access Public
// _______________________________________________
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validates inputs
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account with this email already exists " });
        }

        // Create user - password gets hashed automatically by the pre("save")
        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

//_____________________________________________________________________
// @route POST /api/auth/login
// @access Public
//_____________________________________________________________________
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches.
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            goal: user.goal,
            height: user.height,
            weight: user.waight,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error "});
    }
};

module.exports = { register, login };
