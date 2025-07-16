const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getGallery, uploadGallery } = require('../controllers/galleryController');
const { verifyJWT } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/', getGallery);
router.post('/admin', verifyJWT, upload.fields([
  { name: 'before', maxCount: 1 },
  { name: 'after', maxCount: 1 },
]), uploadGallery);

module.exports = router; 