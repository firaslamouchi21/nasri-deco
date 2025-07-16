const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { submitOrder, getAllOrders } = require('../controllers/ordersController');
const { verifyJWT } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('image'), submitOrder);
router.get('/admin', verifyJWT, getAllOrders);

module.exports = router; 