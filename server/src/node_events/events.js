'use strict';

/* ------------------- Dependencies ------------------- */
const listeners = require('./listeners/index');
const ee = require('./EventEmitter');

/* ------------------- Node events -------------------- */
// Start new hand
ee.on('start_hand', data => listeners.startHand(data));

// Start next round
ee.on('start_next_round', data => listeners.startNextRound(data));
