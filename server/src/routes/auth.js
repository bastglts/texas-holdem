'use strict';

/* ------------------ Dependencies ------------------ */
const express = require('express');
const handlers = require('../controllers/auth');


/* ----------------- Create router ------------------ */
const router = express.Router();


/* -------------- Authentication routes ------------- */
// Register a new user
router.post('/register', handlers.register);

// Find out if user already exists
router.post('/exists', handlers.exists);

// Login
router.post('/login', handlers.login);

// Check if user is logged in
router.get('/isloggedin', handlers.isLoggedIn);

// Logout
router.get('/logout', handlers.logout);

// Fetch Data
router.get('/fetchuserdata', handlers.fetchUserData);


/* ----------------- Export router ------------------ */
module.exports = router;
