const express = require("express");
const router = express.Router();

const {
  updateProfile
} = require("../controllers/userController");

const { protect, authorizeRole } = require("../middlewares/authMiddleware");

// Profile update - authenticated users only
router.put("/profile", protect, updateProfile);

module.exports = router;