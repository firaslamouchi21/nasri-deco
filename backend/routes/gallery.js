const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getGallery, 
  uploadGallery, 
  updateGalleryItem, 
  deleteGalleryItem 
} = require('../controllers/galleryController');
const { verifyJWT } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};
const upload = multer({ storage, fileFilter });

// Public routes
router.get('/', getGallery);

// Admin routes (protected)
router.post('/admin', verifyJWT, upload.fields([
  { name: 'before', maxCount: 1 },
  { name: 'after', maxCount: 1 },
]), uploadGallery);

router.put('/admin/:id', verifyJWT, upload.fields([
  { name: 'before', maxCount: 1 },
  { name: 'after', maxCount: 1 },
]), updateGalleryItem);

router.delete('/admin/:id', verifyJWT, deleteGalleryItem);

module.exports = router; 