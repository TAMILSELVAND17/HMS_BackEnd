const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Image filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

// CSV / Excel filter
const excelFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or Excel files are allowed"), false);
  }
};

module.exports = {
  // Single image upload
  singleUpload: multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).single("profileImage"),

  // Multiple gallery images (max 10)
  galleryUpload: multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array("gallery", 10),

  // Feedback images (max 5)
  feedbackUpload: multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  }).array("images", 5),

  // Excel / CSV file upload
  bulkUpload: multer({
    storage,
    fileFilter: excelFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  }).single("file"),
};
