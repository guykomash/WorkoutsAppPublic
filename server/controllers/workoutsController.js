const Workout = require('../models/Workout');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const { format } = require('date-fns');
const { ObjectId } = require('mongodb');
const { formatName } = require('../utils');

const fetchAll = async (req, res) => {
  console.log('workouts fetchAll');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const Workouts = await Workout.find().exec();
  if (!Workouts) {
    return res.status(204).send({ message: 'No workouts found' });
  } else {
    return res.status(200).send({ Workouts }).end();
  }
};

const fetchById = async (req, res) => {
  console.log('workout fetchById');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const workoutId = req.params.workoutId;
  if (!workoutId)
    return res.status(400).json({ message: 'workout id is required' });

  try {
    const foundWorkout = await Workout.findById(workoutId).exec();
    if (!foundWorkout) {
      console.log(`not found`);
      return res
        .status(400)
        .json({ message: 'Workout was not found - Bad ID' })
        .send();
    } else {
      return res.status(200).json({ workout: foundWorkout }).end();
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(500).end();
  }
};

const fetchByUser = async (req, res) => {
  console.log('workouts fetchByUser');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });
  const foundUser = await User.findById(userId).exec();

  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  // request is OK.
  const savedWorkouts = await Workout.find({
    _id: { $in: foundUser.saved_workouts },
  }).exec();

  const id = foundUser._id;
  const Workouts = await Workout.find({ user_id: id }).exec();
  if (!Workouts) {
    return res.status(500).json({ message: 'err while workouts fetchAll' });
  } else {
    return res.status(200).send({ Workouts, savedWorkouts }).end();
  }
};

const fetchByOtherUser = async (req, res) => {
  console.log('workouts fetchByOtherUser');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  const fetchUserId = req.params.userId;

  if (!fetchUserId)
    return res.status(400).json({ message: 'user id is required' });
  // request is OK.

  const Workouts = await Workout.find({ user_id: fetchUserId }).exec();
  if (!Workouts) {
    return res.status(500).json({ message: 'err while workouts fetchAll' });
  } else {
    return res.status(200).send({ Workouts }).end();
  }
};

const deleteById = async (req, res) => {
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const workoutId = req.params.workoutId;
  if (!workoutId)
    return res.status(400).json({ message: 'workout id is required' });

  const loggedInUser = await User.findById(userId).exec();
  if (!loggedInUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  // request is OK.
  try {
    const foundWorkout = await Workout.findOneAndDelete({
      _id: workoutId,
    }).exec();
    if (!foundWorkout) {
      return res
        .status(400)
        .send({ message: 'Workout was not found - Bad ID' });
    } else return res.status(200).send({ message: 'Workout deleted!' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'error in delete workout' });
  }
  // for re-rendering, return updated Workouts for the user.
  // const id = loggedInUser._id;
  // const Workouts = await Workout.find({ user_id: id }).exec();
  // if (!Workouts) {
  //   return res.status(500).json({ message: 'err while workouts fetchAll' });
  // } else {
  //   return res.status(200).send({ Workouts }).end();
  // }
};

const addWorkout = async (req, res) => {
  console.log('addWorkout');
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

  const { title, note, exercises } = workout;
  const { firstname, lastname } = foundUser.name;

  try {
    //handle exercises. for each exercise, check if need to insert to exercises db. else use existed exercise.
    const newExercises = [];
    for (const exercise of exercises) {
      const dbExercise = await InsertExercieseToDB(exercise);
      let newExercise = {};
      newExercise.exercise_id = dbExercise._id;
      newExercise.title = dbExercise.title;
      newExercise.type = dbExercise.type;
      if (exercise?.sets) newExercise.sets = exercise.sets;
      if (exercise?.reps) newExercise.reps = exercise.reps;
      if (exercise?.rest) newExercise.rest = exercise.rest;
      if (exercise?.tempo) newExercise.tempo = exercise.tempo;
      if (exercise?.rpe) newExercise.rpe = exercise.rpe;
      if (exercise?.note) newExercise.note = exercise.note;
      newExercises.push(newExercise);
    }

    const newWorkout = await Workout.create({
      user_id: new ObjectId(userId),
      author: { firstname, lastname },
      title: title,
      note: note,
      lastUpdated: format(new Date(), 'dd/MM/YYY pp'),
      exercises: newExercises,
    });

    return res.status(201).send({ message: 'Added new workout' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'error in adding workout' });
  }

  // for re-rendering, return updated Workouts for the user.
  // const id = foundUser._id;
  // const Workouts = await Workout.find({ user_id: id }).exec();
  // if (!Workouts) {
  //   return res.status(500).json({ message: 'fetching user workouts failed' });
  // } else {
  //   return res.status(200).send({ Workouts }).end();
  // }
};

const updateById = async (req, res) => {
  console.log('workout updateById');
  const userId = req?.cookies.userId;
  const { workout } = req.body;
  const workoutId = req.params.workoutId;

  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  if (!workout) {
    return res.status(400).json({ message: 'bad workout body request' }).end();
  }
  if (!workoutId)
    return res.status(400).json({ message: 'bad workout id request' });

  // request is ok.

  if (workout.user_id !== userId) {
    console.log('user trying to update others workout');
    return res.status(400).json({ message: 'workout dont belong to user' });
  }

  // find user in DB.
  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res
      .status(500)
      .json({ message: `request userId don't exist in DB` });

  const { title, note, exercises } = workout;

  try {
    //handle exercises. for each exercise, check if need to insert to exercises db. else use existed exercise.
    const newExercises = [];
    for (const exercise of exercises) {
      const dbExercise = await InsertExercieseToDB(exercise);
      let newExercise = {};
      newExercise.exercise_id = dbExercise._id;
      newExercise.title = dbExercise.title;
      newExercise.type = dbExercise.type;
      if (exercise?.sets) newExercise.sets = exercise.sets;
      if (exercise?.reps) newExercise.reps = exercise.reps;
      if (exercise?.rest) newExercise.rest = exercise.rest;
      if (exercise?.tempo) newExercise.tempo = exercise.tempo;
      if (exercise?.rpe) newExercise.rpe = exercise.rpe;
      if (exercise?.note) newExercise.note = exercise.note;
      newExercises.push(newExercise);
    }
    // update workout in DB.
    const result = await Workout.updateOne(
      { _id: workoutId },
      {
        title: title,
        exercises: newExercises,
        note: note,
        lastUpdated: format(new Date(), 'dd/MM/YYY pp'),
      }
    ).exec();

    return res.status(200).send({ message: 'Updated workout successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'error in update workout' });
  }

  // for re-rendering, return updated Workouts for the user.
  // const id = foundUser._id;
  // const Workouts = await Workout.find({ user_id: id }).exec();
  // if (!Workouts) {
  //   return res.status(500).json({ message: 'err while workouts fetchAll' });
  // } else {
  //   return res.status(200).send({ Workouts }).end();
  // }
};

const addSavedWorkout = async (req, res) => {
  console.log('workouts addSavedWorkout');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const workoutId = req.body.workoutId;
  if (!workoutId)
    return res.status(400).json({ message: 'bad workout id request' });

  const update = await User.updateOne(
    { _id: userId },
    {
      $addToSet: { saved_workouts: new ObjectId(workoutId) },
    }
  ).exec();

  // request is OK.
  const foundUser = await User.findById(userId).exec();

  const savedWorkouts = await Workout.find({
    _id: { $in: foundUser.saved_workouts },
  }).exec();

  if (!savedWorkouts) {
    return res.status(500).json({ message: 'err while savedWorkouts' });
  } else {
    return res.status(200).send({ savedWorkouts }).end();
  }
};

const deleteSavedWorkout = async (req, res) => {
  console.log('workouts deleteSavedWorkout');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const workoutId = req.body.workoutId;
  if (!workoutId)
    return res.status(400).json({ message: 'bad workout id request' });

  const update = await User.updateOne(
    { _id: userId },
    {
      $pull: { saved_workouts: new ObjectId(workoutId) },
    }
  ).exec();

  // request is OK.
  const foundUser = await User.findById(userId).exec();

  const savedWorkouts = await Workout.find({
    _id: { $in: foundUser.saved_workouts },
  }).exec();

  if (!savedWorkouts) {
    return res.status(500).json({ message: 'err while savedWorkouts' });
  } else {
    return res.status(200).send({ savedWorkouts }).end();
  }
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

module.exports = {
  fetchAll,
  fetchById,
  addWorkout,
  deleteById,
  fetchByUser,
  updateById,
  fetchByOtherUser,
  addSavedWorkout,
  deleteSavedWorkout,
};
