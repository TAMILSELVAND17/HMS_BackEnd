const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const path = require("path");

const connection = require("./src/config/connection");

const feedbackRoutes = require("./src/routes/feedbackRoutes");
const userRoutes = require("./src/routes/userRoutes");



const app = express();
const port = process.env.PORT || 9000;

// Allow all origins (any frontend)
app.use(cors({
  origin: "*",
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded images from `src/uploads` where multer writes files
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

connection();

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json({ got: req.body });
});



app.use("/api/feedback", feedbackRoutes);
app.use("/api/userRoutes", userRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at: http://localhost:${port}`);
});

