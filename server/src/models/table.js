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
      handStr: String,
    },
    hasFolded: Boolean,
    position: String,
    lastBet: Number,
    isSpeaking: Boolean,
    isAllIn: Boolean,
    isLastRaiser: Boolean,
    seat: Number,
    canRaise: Boolean,
  }],
  board: Array,
  pot: Number,
  lastBet: Number,
  lastRaise: Number,
  shuffledDeck: [String],
  smallBlind: Number,
  bigBlind: Number,
  round: String,
  positions: [String],
  isNewOne: Boolean,
  availSeats: [Number],
  occupiedSeats: [Number],
  buttonSeat: Number,
  bestCards: [String],
  lastLegalRaiser: String,
  sidePots: [{
    claimers: [String],
    initiators: [String],
    extract: Number,
    value: Number,
  }],
});

/* ------------ Create and export Model ----------- */
module.exports = mongoose.model('table', TableSchema);
