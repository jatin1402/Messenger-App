const expressAsyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// responsible for creating and fetching a one on one chat
const accessChats = expressAsyncHandler(async (req, res) => {
  //user who is logged in will give the userid;
  const { userId } = req.body;
  // check if chat with userId is already there , return it
  // else create a chat with this userId

  if (!userId) {
    res.status(401);
    res.send('UserId param not sent with the request body');
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    // now we are finding both of the users, the current user who is logged in coming from req.user._id
    // and the {userId} we are given with
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  // inside of the last message we have
  // the sender field we also need to populate that

  isChat = User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name email picture',
  });

  /// now all the final data for the chat is available;
  // as no other chat can exist except the two users
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [userId, req.user._id],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const FullChatData = await Chat.findById({
        _id: createdChat._id,
      }).populate('users', '-password');
      res.status(200).send(FullChatData);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  // query the chat collection from the database
  // go through every chat and find out for wchich chat
  // user is part of

  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name email picture',
        });
        res.status(200).send(results);
      });
  } catch (err) {
    res.send(400);
    throw new Error(err.message);
  }
});

// take bunch of users from the body
// and take a name of the group chat
const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: 'Please Fill all the fields' });
  }

  // parse the array of users recieved
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .send(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error('Problem in creating the group');
  }
});

const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(400);
    res.send('problem in renaming the group');
  } else {
    res.status(200).send(updatedChat);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    res.status(200).send(added);
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send('problem in adding any person to the group');
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');
  if (!removed) {
    res.status(400);
    res.send('problem in adding any person to the group');
  } else {
    res.status(200).send(removed);
  }
});

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
