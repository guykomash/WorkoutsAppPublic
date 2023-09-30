const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  roles: {
    User: {
      type: Number,
      default: 1111,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
  created: {
    type: String,
    required: true,
  },
  saved_workouts: [ObjectId],
  sessions: [ObjectId],
});

module.exports = mongoose.model('User', userSchema);
