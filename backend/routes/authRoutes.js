const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const upload = require("../middleware/uploadMiddleware");


// ==================================================
// REGISTER
// ==================================================

router.post(
  "/register",
  upload.single("idCard"),
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        confirmPassword,
        gender,
        country,
        state,
        city,
        photo
      } = req.body;

      // Required Fields

      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message: "All required fields are mandatory"
        });
      }

      // Password Match

      if (
        password !== confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match"
        });
      }

      // Password Length

      if ( password.length < 6 ) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters"
        });
      }

      // Existing User Check

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Email already exists"
        });
      }

      // Hash Password

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // Create User

      const user =
        await User.create({

          name,
          email,
          password: hashedPassword,

          gender: gender || "",

          country:
            country || "",

          state:
            state || "",

          city:
            city || "",

          photo:
            photo || "",

          idCard:
            req.file
              ? req.file.filename
              : ""

        });

      // Generate Verification Token

      const activationToken =
        jwt.sign(
          {
            id: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d"
          }
        );

      const activationLink =
        `${process.env.CLIENT_URL}/activate/${activationToken}`;

      // Send Verification Email

      await sendEmail(
        user.email,
        "Account Verification",
        `
          <h2>
            Welcome ${user.name}
          </h2>

          <p>
            Click below link to verify your account.
          </p>

          <a href="${activationLink}">
            Verify Account
          </a>
        `
      );

      res.status(201).json({
        success: true,
        message:
          "Registration successful. Check your email."
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


// ==================================================
// ACTIVATE ACCOUNT
// ==================================================

router.get(
  "/activate/:token",
  async (req, res) => {

    try {

      const decoded =
        jwt.verify(
          req.params.token,
          process.env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      if (
        user.isVerified
      ) {
        return res.json({
          success: true,
          message:
            "Account already verified"
        });
      }

      user.isVerified = true;

      await user.save();

      res.json({
        success: true,
        message:
          "Account verified successfully"
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message:
          "Invalid or expired activation link"
      });

    }

  }
);


// ==================================================
// LOGIN
// ==================================================

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid credentials"
        });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message:
            "Account blocked by admin"
        });
      }

      if (
        !user.isVerified
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Verify your email first"
        });
      }

      const match =
        await bcrypt.compare(
          password,
          user.password
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
            id: user._id,
            role: user.role
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d"
          }
        );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
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


// ==================================================
// FORGOT PASSWORD
// ==================================================

router.post(
  "/forgot-password",
  async (req, res) => {

    try {

      const { email } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found"
        });
      }

      const resetToken =
        jwt.sign(
          {
            id: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "15m"
          }
        );

      user.resetToken =
        resetToken;

      user.resetTokenExpire =
        Date.now() +
        15 * 60 * 1000;

      await user.save();

      const resetLink =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail(
        user.email,
        "Reset Password",
        `
          <h2>Password Reset</h2>

          <p>
            Click below link to reset password
          </p>

          <a href="${resetLink}">
            Reset Password
          </a>
        `
      );

      res.json({
        success: true,
        message:
          "Reset link sent"
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


// ==================================================
// RESET PASSWORD
// ==================================================

router.post(
  "/reset-password/:token",
  async (req, res) => {

    try {

      const { password } =
        req.body;

      const decoded =
        jwt.verify(
          req.params.token,
          process.env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.id
        );

      if (
        !user ||
        user.resetToken !==
        req.params.token ||
        user.resetTokenExpire <
        Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired token"
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.resetToken = null;
      user.resetTokenExpire = null;

      await user.save();

      res.json({
        success: true,
        message:
          "Password reset successful"
      });

    } catch (err) {

      res.status(400).json({
        success: false,
        message:
          "Invalid token"
      });

    }

  }
);

module.exports = router;
