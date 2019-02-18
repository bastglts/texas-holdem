'use strict';

/* ----------------- Dependencies ----------------- */
const mongoose = require('mongoose');


/* --------------- Create Table Schema ------------- */
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  name: String,
  players: [{
    ID: String,
    username: String,
    count: Number,
    holeCards: [String],
    hand: {
      name: String,
      value: Number,
      ordered: [Number],
    },
    folded: Boolean,
    position: String,
    bet: Number,
    isSpeaking: Boolean,
    isPlaying: Boolean,
  }],
  board: Array,
  pot: Number,
  lastBet: Number,
  lastRaise: Number,
  shuffledDeck: [String],
  smallBlind: Number,
  bigBlind: Number,
  postFlop: Boolean,
  positions: [String],
});

/* ------------ Create and export Model ----------- */
module.exports = mongoose.model('table', TableSchema);
