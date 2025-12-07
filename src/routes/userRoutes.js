const express = require("express");
const router = express.Router();

const {
  registerUser,
  setPassword,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  bulkUploadUsers,verifyToken
} = require("../controllers/userController");

const { bulkUpload } = require("../middlewares/multerConfig");

// ================================
// AUTH ROUTES
// ================================
router.post("/register", registerUser);          // Single user register
router.post("/set-password", setPassword);       // Set password from email link
router.post("/login", loginUser);                // Login
router.post("/forgot-password", forgotPassword); // Forgot password
router.post("/reset-password", resetPassword);   // Reset password

router.get('/verify-token',verifyToken);

// ================================
// USER CRUD ROUTES
// ================================
router.get("/all", getAllUsers);            // Get all users
router.get("/:id", getUserById);            // Get specific user
router.put("/:id", updateUser);             // Update user
router.delete("/:id", deleteUser);          // Delete user

// ================================
// BULK USER CREATION (CSV/EXCEL)
// ================================
router.post(
  "/bulk-upload",
  bulkUpload,        // ⬅️ Multer upload single file
  bulkUploadUsers    // ⬅️ Controller to create max 10 users & send link
);

module.exports = router;
