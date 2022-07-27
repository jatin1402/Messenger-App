const asyncHandler = require('express-async-handler');
const generateWebToken = require('../config/generateWebToken');
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('enter all the fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('user already exist');
  }

  // return the value of created object from a database query
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      jwt_token: generateWebToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('failed to create the user');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if the user is there
  const user = await User.findOne({ email });
  console.log(user);
  console.log(await user.matchPassword(password));
  if (user && (await user.matchPassword(password))) {
    console.log('inside if loop', password);
    res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      jwt_token: generateWebToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});
// this url will get hit /api/user/ now we want to send data with the request for that we can send as body for which we have to make a post request
// alternative for this will be sending data through query params
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
  // console.log(keyword);

  // to get req.user._id , we have to first authorise the user and for that
  // we need user to login and provide us the json web token
  // create a new middleware for that

  // query the database;
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { authUser, registerUser, allUsers };
