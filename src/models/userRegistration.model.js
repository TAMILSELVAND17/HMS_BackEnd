const mongoose = require("mongoose");

const userRegistrationSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ]
    },

    // Only required when role === "student"
    phoneNumber: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "student";
      }
    },

    course: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "student";
      }
    },

    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"],
      required: function () {
        return this.role === "student";
      }
    },

    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"]
    },

    // Authentication
    password: {
      type: String,
      required: false,
      default: null
    },

    // Role-Controlled User Type
    role: {
      type: String,
      enum: ["normal", "student", "admin", "superAdmin"],
      default: "normal"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending"
    },

    // Flags
    emailVerified: {
      type: Boolean,
      default: false
    },
    passwordSet: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserRegistration", userRegistrationSchema);
