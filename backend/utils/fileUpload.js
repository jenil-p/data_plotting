const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  if (!file) {
    console.log('fileFilter: No file provided');
    return cb(new Error('No file uploaded'), false);
  }

  console.log('fileFilter: Processing file:', {
    originalName: file.originalname,
    mimetype: file.mimetype,
    extname: path.extname(file.originalname).toLowerCase(),
  });

  const allowedExt = /csv|xlsx|xls/;
  const allowedMime = /csv|vnd\.openxmlformats|vnd\.ms-excel/;
  const extname = allowedExt.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMime.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    const errorMsg = `Only Excel and CSV files are allowed! (Detected: extname=${extname}, mimetype=${file.mimetype})`;
    console.log('fileFilter error:', errorMsg);
    return cb(new Error(errorMsg), false);
  }
};

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter,
});

module.exports = upload;