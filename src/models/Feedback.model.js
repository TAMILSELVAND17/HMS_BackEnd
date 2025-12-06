const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  studentId: { 
    type: String, 
    required: [true, "Student ID is required"] 
  },
  studentName: { 
    type: String, 
    required: [true, "Student name is required"] 
  },
  message: { 
    type: String, 
    required: [true, "Message is required"],
    minlength: [10, "Message should be at least 10 characters long"],
    maxlength: [500, "Message should not exceed 500 characters"]
  },
  images: { 
    type: [String], 
    default: [] 
  },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], // Restrict to specific values
    default: "pending" 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  completedDate: { 
    type: Date, 
    default: null 
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Feedback", feedbackSchema);