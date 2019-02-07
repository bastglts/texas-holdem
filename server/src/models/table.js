'use strict';

/* ----------------- Dependencies ----------------- */
const mongoose = require('mongoose');


/* --------------- Create Table Schema ------------- */
const Schema = mongoose.Schema;

const TableSchema = new Schema({
  name: String,
  players: Array,
  board: Array,
  pot: Number,
});


/* ------------ Create and export Model ----------- */
module.exports = mongoose.model('table', TableSchema);
