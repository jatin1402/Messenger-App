const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  allUsers,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// searching a user by making a get request
router.route('/').post(registerUser).get(protect, allUsers);
router.route('/login').post(authUser);

module.exports = router;
