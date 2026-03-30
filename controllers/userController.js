const User = require("../models/User");

// ________________________________________
// @route GET /api/users/profile
// @access Private
//_________________________________________
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//___________________________________________
// @route PUT /api/users/prfile
// @access Private
//___________________________________________
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) res.status(404).json({ message: "User not found" });

    // Update fields that were were actually sent.
    const {
      name,
      goal,
      height,
      weight,
      avatar,
      weightUnit,
      notifications,
      hasOnboarded,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (goal !== undefined) user.goal = goal;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (avatar !== undefined) user.avatar = avatar;
    if (weightUnit !== undefined) user.weightUnit = weightUnit;
    if (hasOnboarded !== undefined) user.hasOnboarded = hasOnboarded;
    if (notifications !== undefined) user.notifications = notifications;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      goal: updatedUser.goal,
      height: updatedUser.height,
      weight: updatedUser.weight,
      avatar: updatedUser.avatar,
      weightUnit: updatedUser.weightUnit,
      notifications: updatedUser.notifications,
      hasOnboarded: updatedUser.hasOnboarded,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//____________________________________________________________
// @route PUT /api/users/password
// @access Private
//_____________________________________________________________
const updatedPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Checks for input fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    // Checks for password character length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id);

    // Verify current password before allowing change.
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Saves the new password
    user.password = newPassword;
    await user.save();

    // Notify user of action status
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error:" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatedPassword,
};
