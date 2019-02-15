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
  }],
  board: Array,
  pot: Number,
  playing: Boolean,
});


/* ------------ Create and export Model ----------- */
module.exports = mongoose.model('table', TableSchema);
