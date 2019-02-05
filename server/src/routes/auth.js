'use strict';

/* ------------------ Dependencies ------------------ */
const express = require('express');
const handlers = require('../controllers/auth/index');


/* ----------------- Create router ------------------ */
const router = express.Router();


/* -------------- Authentication routes ------------- */
// Register a new user
router.post('/register', handlers.register);

// Login
router.post('/login', handlers.login);

// Logout
router.get('/logout', handlers.logout);


/* ----------------- Export router ------------------ */
module.exports = router;
