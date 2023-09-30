const Session = require('../models/Session');
const Workout = require('../models/Workout');
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const { format, formatISO } = require('date-fns');
const { ObjectId } = require('mongodb');
const { formatName } = require('../utils');

const fetchAllSessions = async (req, res) => {
  console.log('fetchAllSessions');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });
  const foundUser = await User.findById(userId).exec();

  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  // request is OK.

  const id = foundUser._id;
  const sessions = await Session.find({ user_id: id }).exec();
  if (!sessions) {
    return res
      .status(500)
      .json({ message: 'request sessionId doesnt exist DB' });
  } else {
    return res.status(200).send({ sessions });
  }
};

const fetchSession = async (req, res) => {
  console.log('fetchSession');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });
  const foundUser = await User.findById(userId).exec();

  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  const sessionId = req?.params?.sessionId;

  // request is OK.
  console.log(sessionId);

  try {
    const session = await Session.findById(sessionId).exec();

    if (!session) {
      return res
        .status(204)
        .send({ message: 'request sessionId doesnt exist DB' });
    } else {
      if (session?.user_id.toString() !== userId)
        return res
          .status(400)
          .send({ message: `user tried to fetch other user's session` });

      // All good. send session to client.
      return res.status(200).send({ session });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: 'Server error while fetching session' });
  }
};

const createNewSession = async (req, res) => {
  console.log('createNewSession');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  // title - format current date.
  const weekDay = format(new Date(), 'eeee');
  const flexTime = formatName(format(new Date(), 'BBBB').split(' ').pop());
  const titleDate = format(new Date(), 'MMMM do yyyy');

  const title = `${weekDay} ${flexTime}, ${titleDate}`;
  console.log(title);
  const date = new Date();
  // session exercises.
  try {
    const { workoutId } = req.body;
    if (workoutId) {
      // user chose an workout template.
      const templateWorkout = await Workout.findById(workoutId).exec();
      if (!templateWorkout)
        return res
          .status(400)
          .send({ message: 'Bad template workout request' });

      // load session details from template workout
      const sessionExercises = templateWorkout.exercises.map((exercise) => {
        return {
          title: exercise?.title,
          type: exercise.type,
          sets: exercise?.sets,
          reps: exercise?.reps,
          rest: exercise?.rest,
          tempo: exercise?.tempo,
          rpe: exercise?.rpe,
          note: exercise?.note,
          session_sets: [
            {
              set_weight: '',
              set_reps: '',
              set_note: '',
            },
          ],
        };
      });

      const newSession = await Session.create({
        user_id: new ObjectId(userId),
        title: title,
        date: date,
        workout_id: templateWorkout._id,
        workout_note: templateWorkout.note,
        note: templateWorkout.note,
        exercises: sessionExercises,
      });

      // return sessionId for re-direct in client side.
      return res.status(201).send({ sessionId: newSession._id });
    } else {
      console.log('user didnt chose template workout.');

      const newSession = await Session.create({
        user_id: foundUser._id,
        title: title,
        date: date,
        note: '',
        exercises: [
          {
            session_sets: [
              {
                set_weight: '',
                set_reps: '',
                set_note: '',
              },
            ],
          },
        ],
      });

      // return sessionId for re-direct in client side.
      res.status(201).send({ sessionId: newSession._id });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ message: 'server error while creating session' });
  }
};

const updateSession = async (req, res) => {
  console.log('updateSession');
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  const { sessionId } = req?.params;
  console.log(sessionId);

  const { session } = req.body;
  console.log(session);

  const { user_id, title, date, exercises, note } = session;

  try {
    //handle exercises. for each exercise, check if need to insert to exercises db. else use existed exercise.
    const newExercises = [];
    for (const exercise of exercises) {
      const dbExercise = await InsertExercieseToDB(exercise);
      let newExercise = {};
      newExercise.exercise_id = dbExercise._id;
      newExercise.title = dbExercise.title;
      let newSessionSets = [];
      for (const set of exercise.session_sets) {
        newSessionSets.push({
          set_weight: set.set_weight,
          set_reps: set.set_reps,
          set_note: set.set_note,
        });
      }
      newExercise.session_sets = newSessionSets;
      if (exercise?.sets) newExercise.sets = exercise.sets;
      if (exercise?.reps) newExercise.reps = exercise.reps;
      if (exercise?.rest) newExercise.rest = exercise.rest;
      if (exercise?.tempo) newExercise.tempo = exercise.tempo;
      if (exercise?.rpe) newExercise.rpe = exercise.rpe;
      if (exercise?.note) newExercise.note = exercise.note;

      newExercises.push(newExercise);
    }
    // updateOne?
    const result = await Session.updateOne(
      { _id: sessionId },
      {
        user_id: user_id,
        title: title,
        date: date,
        workout_id: session?.workout_id,
        workout_note: session?.workout_note,
        exercises: newExercises,
        note: note,
      }
    ).exec();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'error in update session' });
  }

  return res.sendStatus(200);

  // updateOne?
  // const result = await Workout.updateOne(
  //   { _id: workoutId },
  //   {
  //     title: title,
  //     exercises: newExercises,
  //     note: note,
  //     lastUpdated: format(new Date(), 'dd/MM/YYY pp'),
  //   }
  // ).exec();
  //
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
  fetchAllSessions,
  fetchSession,
  createNewSession,
  updateSession,
};
