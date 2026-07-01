const jwt = require('jsonwebtoken');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (password === process.env.ADMIN_PASSWORD) {
      // 1. Create the JWT Token
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
      });

      // 2. Lock it in an HTTP-Only Cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // Use HTTPS in production
        sameSite: 'lax', // Prevents CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });

      res.status(200).json({ message: 'Logged in successfully' });
    } else {
      res.status(401);
      throw new Error('Invalid master password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout admin / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutAdmin = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { loginAdmin, logoutAdmin };