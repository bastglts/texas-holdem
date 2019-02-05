'use strict';

/* ------------------ Dependencies ------------------ */
const express = require('express');
const handlers = require('../controllers/user/index');


/* ----------------- Create router ------------------ */
const router = express.Router();


/* ------------------- User routes ------------------ */
// Check if user is logged in
router.get('/isloggedin', handlers.isLoggedIn);

// Fetch Data
router.get('/fetchuserdata', handlers.fetchUserData);

// Find out if user already exists
router.post('/isunique', handlers.isUnique);

/* ----------------- Export router ------------------ */
module.exports = router;
