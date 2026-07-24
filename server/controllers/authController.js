const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess } = require("../utils/apiResponse");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  sendSuccess(res, 201, "Registration successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, "Login successful", {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token,
  });
});

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile fetched", { user: req.user });
});

/**
 * @desc    Update logged-in user's profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;

  if (req.body.password) {
    user.password = req.body.password; // will be hashed by pre-save hook
  }

  const updatedUser = await user.save();

  sendSuccess(res, 200, "Profile updated", {
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
    },
  });
});

/**
 * @desc    Logout (client-side token removal; endpoint exists for
 *          symmetry / future cookie-based auth / audit logging)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Logged out successfully");
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
};
