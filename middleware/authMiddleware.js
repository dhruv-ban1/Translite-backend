const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // If valid, let them proceed to the route
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

module.exports = { protect };