const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware =
  require("../middleware/authMiddleware");
const adminMiddleware =
  require("../middleware/adminMiddleware");

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const admin =
        await User.findOne({
          email
        });

      if (!admin) {
        return res.status(404).json({
          success: false,
          message:
            "Admin not found"
        });
      }
      if (
        admin.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied"
        });
      }

      const match =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!match) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid credentials"
        });
      }

      const token =
        jwt.sign(
          {
            id: admin._id,
            role: admin.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );

      res.json({
        success: true,
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
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

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalUsers =
        await User.countDocuments({
          role: "user"
        });
      const totalAdmins =
        await User.countDocuments({
          role: "admin"
        });
      const blockedUsers =
        await User.countDocuments({
          isBlocked: true
        });
      const verifiedUsers =
        await User.countDocuments({
          isVerified: true
        });

      res.json({
        success: true,
        stats: {
          totalUsers,
          totalAdmins,
          blockedUsers,
          verifiedUsers
        }
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

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users =
        await User.find()
        .select("-password")
        .sort({
          createdAt: -1
        });
      res.json({
        success: true,
        count:
          users.length,
        users
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

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Prevent self delete
      if (
        req.user.id ===
        req.params.id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Admin cannot delete own account"
        });
      }

      const user =
        await User.findById(
          req.params.id
        );
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );
      res.json({
        success: true,
        message:
          "User deleted successfully"
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

router.put(
  "/users/:id/block",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Prevent self block
      if (
        req.user.id ===
        req.params.id
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Admin cannot block own account"
        });
      }
      const user =
        await User.findById(
          req.params.id
        );
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }
      user.isBlocked =
        !user.isBlocked;
      await user.save();
      res.json({
        success: true,
        message:
          user.isBlocked
            ? "User blocked successfully"
            : "User unblocked successfully",
        isBlocked:
          user.isBlocked
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

router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        )
        .select("-password");
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

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.id
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

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
        idCard,
      } = req.body;

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Email duplicate check

      if (
        email &&
        email !== user.email
      ) {
        const existingUser =
          await User.findOne({
            email,
            _id: {
              $ne: req.user.id,
            },
          });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            message:
              "Email already exists",
          });
        }
      }

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.gender = gender || user.gender;
      user.country = country || user.country;
      user.state = state || user.state;
      user.city = city || user.city;
      user.photo = photo || user.photo;
      user.idCard = idCard || user.idCard;

      await user.save();
      res.json({
        success: true,
        message:
          "Profile updated successfully",
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.put(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      if (
        !oldPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters",
        });
      }

      const user = await User.findById(
        req.user.id
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Old password is incorrect",
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
          "Password changed successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

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
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message:
          "Account deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.get(
  "/logout",
  authMiddleware,
  async (req, res) => {
    res.json({
      success: true,
      message:
        "Logout successful. Remove token from frontend.",
    });
  }
);

module.exports = router;