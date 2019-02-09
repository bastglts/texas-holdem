'use strict';

/* ------------------ Dependencies ------------------ */
const express = require('express');
const handlers = require('../controllers/table/index');


/* ----------------- Create router ------------------ */
const router = express.Router();


/* ------------------- User routes ------------------ */
// Find out if table already exists
router.post('/isunique', handlers.isUnique);

// Create a new table
router.post('/createtable', handlers.createTable);

/* ----------------- Export router ------------------ */
module.exports = router;
