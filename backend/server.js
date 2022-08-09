const express = require('express');
const chats = require('./data/chats');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to tell the server to accept the json data

app.get('/', (req, res) => {
  res.send('Hi there');
});

// // creating an api to get all the chats
// app.get('/api/chat', (req, res) => {
//   res.send(chats);
// });

// // creating an api to get any particular chat
// app.get('/api/chat/:id', (req, res) => {
//   //   console.log(req);
//   const singleChat = chats.find((chat) => chat._id === req.params.id);
//   res.send(singleChat);
// });

// user authentication routes
app.use('/api/user', userRoutes);
// loading chat routes;
app.use('/api/chat', chatRoutes);

//error handling routes, if wrong route we are prividing the it will fall onto not found reoute,
// other errors will be handled by error handler

app.use(notFound);
app.use(errorHandler);

//creating a web server which will listen at port 5000
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`.yellow.bold);
});

// whenever making a call from frontend to backend it with through a CORS error,
// to avoid that we need to give proxy to our frontend app,
// in order to ensure both url have same origin
