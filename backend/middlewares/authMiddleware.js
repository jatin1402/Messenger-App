const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      console.log('inside try block');
      token = req.headers.authorization.split(' ')[1];
      // decode the token
      // console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findOne({ _id: decoded.id }).select('-password');
      console.log(req.user);
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error('token failed, not authorized');
    }
  }
  if (!token) {
    res.status(400);
    throw new Error('not authorized, no token given');
  }
});

module.exports = { protect };
