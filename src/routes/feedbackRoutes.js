const express = require("express");
const router = express.Router();
const { feedbackUpload } = require("../middlewares/multerConfig");

const {
  addFeedback,
  getAll,
  updateStatus,
  deleteFeedback
} = require("../controllers/feedbackController");

// POST /api/feedback/createFeedback - Create new feedback with images
router.post("/createFeedback", feedbackUpload, addFeedback);

// GET /api/feedback - Get all feedbacks
router.get("/getall", getAll);

// PUT /api/feedback/:id/status - Update feedback status
router.put("/:id/status", updateStatus);

// DELETE /api/feedback/:id - Delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;