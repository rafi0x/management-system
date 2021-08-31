const multer = require("multer");
const path = require("path");

// argument for dir name
const imgStore = (dir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../public/uploads/${dir}`));
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname)
        ? path.extname(file.originalname)
        : `.${file.mimetype.split("/")[1]}`; // if get blob image data, app the extention from file type. (blob data comes wihtout extention)

      cb(
        null,
        `${file.fieldname}-${req.user.username}-${Date.now()}${extname}`
      );
    },
  });
};

const multiStore = (dir) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../public/uploads/${dir}`));
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname)
        ? path.extname(file.originalname)
        : `.${file.mimetype.split("/")[1]}`; // if get blob image data, app the extention from file type. (blob data comes wihtout extention)

      cb(
        null,
        `${file.originalname.replace(
          path.extname(file.originalname),
          ""
        )}${extname}`
      );
    },
  });
};

const uploader = {};

// set this upload function for accept image and document upload, take file type as arg, also dir arg for dir where to save
uploader.imgUpload = (dirName) => {
  return multer({
    storage: imgStore(dirName),
    fileFilter: (req, file, cb) => {
      const type = /jpg|png|jpeg/i;
      const mimetype = type.test(file.mimetype);

      if (mimetype) {
        cb(null, true);
      } else {
        cb(new Error("only png, jpg, jpeg will work"));
      }
    },
  });
};

uploader.multiUpload = (dirName) => {
  return multer({
    storage: multiStore(dirName),
    fileFilter: (req, file, cb) => {
      const type = /jpg|png|jpeg|pdf|csv|doc|docx|text/i;
      // const fileExt = type.test(path.extname(file.orginalname));
      const mimetype = type.test(file.mimetype);

      if (mimetype) {
        cb(null, true);
      } else {
        cb(new Error("only pdf, csv, doc, txt, jpg, png, jpeg will work"));
      }
    },
  });
};

module.exports = uploader;
