const admin = require('../../firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized: No token provided'
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized: Invalid or expired token',
      error: error.message
    });
  }
};

module.exports = verifyToken;
