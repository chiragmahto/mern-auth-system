const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination:
      function ( req, file, cb ) {
        cb(
          null,
          "uploads/idcards"
        );
      },

    filename:
      function (req, file, cb) {
        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );
      }
  });

// File Type Validation

const fileFilter =
  (req, file, cb) => {
    const allowedTypes = [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf"
    ];

    const ext =
      path.extname(
        file.originalname
      )
      .toLowerCase();
    if (allowedTypes.includes(ext)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, PDF allowed"
        )
      );
    }
  };

// Upload Config

const upload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024
    }
  });

module.exports = upload