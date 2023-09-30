const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  user_id: { type: ObjectId, required: true },
  author: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  },
  title: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  exercises: [
    {
      exercise_id: ObjectId,
      title: { type: String, required: true },
      type: { type: String, required: true },
      sets: String,
      reps: String,
      rest: String,
      tempo: String,
      rpe: String,
      note: String,
    },
  ],
  note: String,
});

module.exports = mongoose.model('Workout', workoutSchema);
