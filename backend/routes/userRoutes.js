const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const authMiddleware =
  require("../middleware/authMiddleware");


// ===================================================
// GET PROFILE
// GET /api/users/profile
// ===================================================

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message
      });

    }

  }
);


// ===================================================
// EDIT PROFILE
// PUT /api/users/edit-profile
// ===================================================

router.put(
  "/edit-profile",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        name,
        email,
        gender,
        country,
        state,
        city,
        photo,
        idCard
      } = req.body;

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      // Email Duplicate Check

      if (
        email &&
        email !== user.email
      ) {

        const existingUser =
          await User.findOne({
            email,
            _id: {
              $ne: req.user.id
            }
          });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message:
              "Email already exists"
          });
        }

      }

      // Update Fields

      user.name =
        name || user.name;

      user.email =
        email || user.email;

      user.gender =
        gender || user.gender;

      user.country =
        country || user.country;

      user.state =
        state || user.state;

      user.city =
        city || user.city;

      user.photo =
        photo || user.photo;

      user.idCard =
        idCard || user.idCard;

      await user.save();

      res.json({
        success: true,
        message:
          "Profile updated successfully",
        user
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message
      });

    }

  }
);


// ===================================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// ===================================================

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        oldPassword,
        newPassword
      } = req.body;

      if (
        !oldPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields required"
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters"
        });
      }

      const user =
        await User.findById(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      const match =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!match) {
        return res.status(400).json({
          success: false,
          message:
            "Old password is incorrect"
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.json({
        success: true,
        message:
          "Password changed successfully"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message
      });

    }

  }
);


// ===================================================
// DELETE ACCOUNT
// DELETE /api/users/delete-account
// ===================================================

router.delete(
  "/delete-account",
  authMiddleware,
  async (req, res) => {

    try {

      const user =
        await User.findByIdAndDelete(
          req.user.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      res.json({
        success: true,
        message:
          "Account deleted successfully"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message:
          err.message
      });

    }

  }
);


// ===================================================
// LOGOUT
// GET /api/users/logout
// ===================================================

router.get(
  "/logout",
  authMiddleware,
  async (req, res) => {

    res.json({
      success: true,
      message:
        "Logout successful. Remove token from frontend."
    });

  }
);


module.exports = router;
