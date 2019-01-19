'use strict';

/* ------------------ Dependencies ---------------- */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');

const authRoutes = require('./routes/auth');
const User = require('./models/user');
const dbConfig = require('./config/db');


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
app.use(cookieSession({
  maxAge: 120 * 1000,
  keys: ['onetwoonetwothisisatest'],
}));

// Update a value in the cookie when receiving a request every minute top so that the set-cookie
// header will be sent, thus extending the session expiration.
app.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});


/* -------------- Configure passport -------------- */
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());


/* ------- Create server and listen to port ------- */
app.listen(8081, () => {
  console.log('server running on port 8081');
});


/* ------- Configure and connect to database ------ */
mongoose.connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to the database');
  }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });


/* ----------------- Set up routes ---------------- */
app.use('/auth', authRoutes);
