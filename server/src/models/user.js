'use strict';

/* ----------------- Dependencies ----------------- */
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


/* --------------- Create User Schema ------------- */
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  count: Number,
});

UserSchema.plugin(passportLocalMongoose);


/* ------------ Create and export Model ----------- */
module.exports = mongoose.model('user', UserSchema);
