const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    user_id: { $type: ObjectId, required: true },
    title: { $type: String, required: true },
    date: { $type: Date, required: true },
    workout_id: ObjectId,
    workout_note: String,
    note: String,
    exercises: [
      {
        exercise_id: ObjectId,
        title: String,
        type: String,
        sets: String,
        reps: String,
        rest: String,
        tempo: String,
        rpe: String,
        note: String,
        session_sets: [
          {
            set_weight: String,
            set_reps: String,
            set_note: String,
          },
        ],
      },
    ],
  },
  { typeKey: '$type' }
);

module.exports = mongoose.model('Session', sessionSchema);
