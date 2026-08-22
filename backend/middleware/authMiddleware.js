const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {

  try {
    const header =
      req.headers.authorization;
    // Check authorization header

    if (
      !header ||
      !header.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "No token provided"
      });
    }

    // Extract token
    const token =
      header.split(" ")[1];

    // Verify token

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // Attach user info
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token"
    });
  }
};