const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req.body.userName",req.body.userName)
    let uploadPath = "";
    if(req.body.qrName) {
       uploadPath = `uploads/${req.body.qrName}`; 
    }else if(req.body.userName) {
       uploadPath = `paymentscreenshot/${req.body.userName}`; 
    }
    console.log(file)
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
