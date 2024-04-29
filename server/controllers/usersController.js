const User = require('../models/user');
const ROLES_LIST = require('../config/roles_list');
const Workout = require('../models/Workout');
const Session = require('../models/Session');

const getAccountDataByUser = async (req, res) => {
  const userId = req?.cookies?.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const foundUser = await User.findById(userId).exec();
  if (!foundUser)
    return res.status(500).json({ message: 'request userId dont exist id DB' });

  // request OK.
  console.log(foundUser);
  const firstName = foundUser?.name?.firstname;
  const lastName = foundUser?.name?.lastname;
  const userName = foundUser?.username;
  const created = foundUser?.created;
  res
    .status(200)
    .send({
      user: {
        userName,
        firstName,
        lastName,
        created,
      },
    })
    .end();
};

const fetchAllUsers = async (req, res) => {
  const userId = req?.cookies?.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });
  // request OK.
  const users = await User.find().exec();
  if (!users) {
    return res.status(204).send({ message: 'No users found' });
  } else {
    return res.status(200).send({ users }).end();
  }
};

const fetchUserById = async (req, res) => {
  console.log('fetchUserById');
  const userId = req?.cookies?.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });
  // request OK.
  const user = await User.findById(userId).exec();
  if (!user) {
    return res.status(204).send({ message: 'No user found' });
  } else {
    return res.status(200).send({ user }).end();
  }
};

const deleteUserById = async (req, res) => {
  const userId = req?.cookies?.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const deleteUserId = req?.params?.userId;
  if (!deleteUserId)
    return res.status(400).send({ message: 'bad delete user id' });

  if (deleteUserId === userId) {
    console.log('User cannot delete own account.');
    return res.status(400).send({ message: 'user cannot delete own account' });
  }
  console.log(`delete ${deleteUserId}`);

  //request OK.
  try {
    const foundUser = await User.findByIdAndDelete(deleteUserId).exec();
    if (!foundUser)
      return res.status(400).send({ message: 'User was not found - Bad ID' });

    //delete the user workouts & sessions.
    const deleteWorkouts = await Workout.deleteMany({
      user_id: deleteUserId,
    }).exec();
    const deleteSessions = await Session.deleteMany({
      user_id: deleteUserId,
    }).exec();
  } catch (err) {
    console.log(err);
  }

  // return all users for re-rendering
  const users = await User.find().exec();
  if (!users) {
    return res.status(204).send({ message: 'No users found' });
  } else {
    return res.status(200).send({ users }).end();
  }
};

const updateRolesById = async (req, res) => {
  const userId = req?.cookies?.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const updateUserId = req?.params?.userId;
  console.log(updateUserId);

  if (!updateUserId)
    return res.status(400).send({ message: 'bad update user id' });

  const newRoles = req?.body?.roles;
  if (!newRoles) return res.status(400).send({ message: 'bad roles' });

  console.log(newRoles);
  //modify roles.
  for (let role in newRoles) {
    if (newRoles[role] === true) newRoles[role] = ROLES_LIST[role];
    else delete newRoles[role];
  }
  console.log(newRoles);

  if (updateUserId === userId) {
    console.log('User cannot modify is own roles.');
    return res.status(400).send({ message: 'User cannot modify is own roles' });
  }
  console.log(`user ${updateUserId}`);

  //request OK.
  try {
    const foundUser = await User.updateOne(
      { _id: updateUserId },
      {
        roles: newRoles,
      }
    ).exec();
    if (!foundUser)
      return res.status(400).send({ message: 'User was not found - Bad ID' });

    return res.status(200).send({ user: foundUser }).end();
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Server error in update roles.' });
  }
};

module.exports = {
  getAccountDataByUser,
  fetchAllUsers,
  deleteUserById,
  updateRolesById,
  fetchUserById,
};
