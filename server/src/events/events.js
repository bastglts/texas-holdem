'use strict';

/* ------------------- Dependencies ------------------- */
const listeners = require('./listeners/index');
const ee = require('./EventEmitter');

/* ------------------- Node events -------------------- */
// Play the round
ee.on('play_round', (data) => listeners.playRound(data));
