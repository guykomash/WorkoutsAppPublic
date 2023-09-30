const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const User = require('../models/User');
const { ObjectId } = require('mongodb');
const { format } = require('date-fns');
const { formatName } = require('../utils');

const fetchAllExercises = async (req, res) => {
  console.log('fetchAllExercises');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const exercises = await Exercise.find().exec();
  if (!exercises) {
    return res.status(204).send({ message: 'No exercises found' });
  } else {
    return res.status(200).send({ exercises }).end();
  }
};

const addExercise = async (req, res) => {
  console.log('add Exercise');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const { exercise } = req.body;
  console.log(exercise);
  const title = exercise.title;
  const type = exercise.type || null;

  if (!exercise || !title) {
    return res.status(400).json({ message: 'bad add Exercise request' }).end();
  }
  // SEARCH FOR DUPLICATES.
  const duplicate = await Exercise.find({ title: title, type: type }).exec();
  console.log(duplicate);
  if (duplicate) return res.sendStatus(409);

  if (type !== null) {
    await Exercise.create({
      title: title,
      type: type,
    });
  } else {
    await Exercise.create({
      title: title,
    });
  }

  return res.status(200).send({ Exercise }).end();
};

const test = async (req, res) => {
  console.log('test');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const { workout } = req.body;
  if (!workout) {
    return res.status(400).json({ message: 'bad add Workout request' }).end();
  }

  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  const { title, exercises } = workout;
  const { firstname, lastname } = foundUser.name;

  //handle exercises. for each exercise, check if need to insert to exercises db. else use existed exercise.
  const newExercises = [];
  for (const exercise of exercises) {
    const dbExercise = await InsertExercieseToDB(exercise);
    console.log(dbExercise);
    let newExercise = {};
    newExercise.exercise_id = dbExercise._id;
    newExercise.title = dbExercise.title;
    newExercise.type = dbExercise.type;
    if (exercise?.sets) newExercise.sets = exercise.sets;
    if (exercise?.reps) newExercise.reps = exercise.reps;
    if (exercise?.duration) newExercise.duration = exercise.duration;
    if (exercise?.distance) newExercise.distance = exercise.distance;
    newExercises.push(newExercise);
  }

  console.log(newExercises);
  const newWorkout = Workout.create({
    user_id: new ObjectId(userId),
    author: { firstname, lastname },
    title: title,
    lastUpdated: format(new Date(), 'dd/MM/YYY pp'),
    exercises: newExercises,
  });

  return res.sendStatus(200);
};

const InsertExercieseToDB = async (exercise) => {
  if (!exercise?.title || !exercise?.type) return null;
  if (exercise?.exercise_id) {
    const foundExercise = await Exercise.findOne({
      _id: exercise?.exercise_id,
    }).exec();
    if (foundExercise) {
      return foundExercise;
    }
  } else {
    // try to find by title and type.
    const formattedtitle = formatName(exercise.title);
    const foundExercise = await Exercise.findOne({
      title: formattedtitle,
      type: exercise.type,
    }).exec();
    if (foundExercise) {
      return foundExercise;
    }
    const newExercise = Exercise.create({
      title: formattedtitle,
      type: exercise.type,
    });
    return newExercise;
  }
};
module.exports = { fetchAllExercises, addExercise, test };
