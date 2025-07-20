const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'PLEASE_SET_A_STRONG_SECRET_IN_ENV';

function verifyAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = verifyAdmin; 