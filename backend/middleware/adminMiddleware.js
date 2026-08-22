module.exports = (req, res, next) => {
  try {
    if (req.user.role !=="admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin access denied"
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Authorization error"
    });
  }
};