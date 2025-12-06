const User = require("../models/userRegistration.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const sendMailToUser = require("../utils/email");

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SECRET_KEY";

// ==================================================
// REGISTER USER (Send password setup link)
// ==================================================
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, address, role, phoneNumber, course, year } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !address) {
      return res.status(400).json({ 
        success: false,
        error: "First name, last name, email, and address are required" 
      });
    }

    // Create user without password
    const user = await User.create({
      firstName,
      lastName,
      email,
      address,
      role: role || "normal",
      phoneNumber,
      course,
      year,
      password: null,
      passwordSet: false
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

    await sendMailToUser(
      user.email,
      "Set Your Password - HMS",
      `
      <h2>Welcome to HMS!</h2>
      <p>Click the link below to set your password:</p>
      <a href="${link}" style="color:blue;">${link}</a>
      <p>This link is valid for 24 hours.</p>
      `
    );

    res.status(201).json({
      success: true,
      message: "User registered. Password setup link sent to email."
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ==================================================
// BULK UPLOAD (Max 10 users + send email)
// ==================================================
const bulkUploadUsers = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (rows.length > 10)
      return res.status(400).json({ success: false, message: "Max 10 users allowed" });

    let createdUsers = [];

    for (let row of rows) {
      if (!row.email) continue;

      const user = await User.create({
        firstName: row.firstName || "",
        lastName: row.lastName || "",
        email: row.email,
        address: row.address || "",
        role: row.role || "normal",
        phoneNumber: row.phoneNumber || "",
        course: row.course || "",
        year: row.year || "",
        password: null,
        passwordSet: false
      });

      createdUsers.push(user);

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

      const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

      await sendMailToUser(
        user.email,
        "Set Your Password - HMS",
        `
        <h2>Welcome to HMS!</h2>
        <p>Click the link below to set your password:</p>
        <a href="${link}">${link}</a>
        `
      );
    }

    res.json({
      success: true,
      message: "Users uploaded & password setup link sent",
      count: createdUsers.length
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==================================================
// SET PASSWORD (From email link)
// ==================================================
const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashed,
      passwordSet: true,
      emailVerified: true,
    });

    res.json({ success: true, message: "Password set successfully." });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

// ==================================================
// LOGIN
// ==================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    if (!user.passwordSet)
      return res.status(400).json({ success: false, message: "Password not set. Check email." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==================================================
// UPDATE USER
// ==================================================
const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
      updates.passwordSet = true;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user: updatedUser });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ==================================================
// FORGOT PASSWORD
// ==================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "Email not found" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMailToUser(
      user.email,
      "Reset Password - HMS",
      `
      <h3>Password Reset</h3>
      <p>Click below to reset:</p>
      <a href="${link}">${link}</a>
      `
    );

    res.json({ success: true, message: "Reset link sent" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==================================================
// RESET PASSWORD
// ==================================================
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashed,
      passwordSet: true,
    });

    res.json({ success: true, message: "Password reset successful." });

  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};

// ==================================================
// DELETE USER
// ==================================================
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ==================================================
// GET ALL USERS
// ==================================================
const getAllUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
};

// ==================================================
// GET USER BY ID
// ==================================================
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  res.json({ success: true, user });
};

// EXPORTS
module.exports = {
  registerUser,
  setPassword,
  loginUser,
  forgotPassword,
  resetPassword,
  bulkUploadUsers,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
