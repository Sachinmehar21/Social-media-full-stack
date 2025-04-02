const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/upload');
    },
    filename: function (req, file, cb) {
        const uniqueFileName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFileName);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
