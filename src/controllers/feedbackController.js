const Feedback = require("../models/Feedback.model");

// Create new feedback
const addFeedback = async (req, res) => {
  try {
    const { studentId, studentName, message } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const feedback = new Feedback({
      studentId,
      studentName,
      message,
      images,
      date: new Date().toISOString().split("T")[0],
    });

    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all feedbacks
const getAll = async (req, res) => {
  try {
    const data = await Feedback.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status, completedDate: status === "completed" ? new Date().toISOString().split("T")[0] : null },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Default export object
module.exports = {
  addFeedback,
  getAll,
  updateStatus,
  deleteFeedback
};