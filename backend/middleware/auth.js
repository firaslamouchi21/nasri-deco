const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Malformed token' });
  jwt.verify(token, process.env.token_secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.admin = decoded;
    next();
  });
}

module.exports = { verifyJWT }; 