'use strict';

/* ------------------ Dependencies ---------------- */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/user');
const dbConfig = require('./config/db');
const socketListeners = require('./socket/listeners');


/* -------------- Create express app -------------- */
const app = express();


/* ------------- Configure middlewares ------------ */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));


/* --------------- Configure cookies -------------- */
require('dotenv').config();
const { COOKIE_KEY } = process.env;

app.use(cookieSession({
  maxAge: 2 * 3600 * 1000,
  keys: [COOKIE_KEY],
}));

// Update a value in the cookie when receiving a request every hour top so that
// the set-cookieheader will be sent, thus extending the session expiration.
app.use(function (req, res, next) {
  req.session.nowInhours = Math.floor(Date.now() / 3600e3);
  next();
});


/* -------------- Configure passport -------------- */
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());


/* ----------------- Set up routes ---------------- */
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


/* ----- Connect to database and create server ---- */
mongoose.connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to the database');

    // Create server and listen to port
    const server = app.listen(8081, () => {
      console.log('server running on port 8081');
    });


    // Create socket.io instance
    const io = socketIo(server);

    io.on('connection', (socket) => {
      socketListeners(socket, io);
    });
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });
