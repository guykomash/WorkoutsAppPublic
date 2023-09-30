const User = require('../models/User');

const handleLogout = async (req, res) => {
  // * delete the accessToken on client-side!

  console.log('handleLogout');

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no cookie to delete , OK.

  const refreshToken = cookies.jwt;
  // grab user from DB by refreshToken
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

  if (!foundUser) {
    // found cookie , but no user in db => only clearCookie
    return res.clearCookie('jwt', { httpOnly: true }).sendStatus(403);
  }

  // delete refreshToken in DB , clearCookie
  foundUser.refreshToken = '';
  await foundUser.save();

  //secure:true = > only serves on https => add in production

  res
    .clearCookie('jwt', {
      httpOnly: true,
    })
    .clearCookie('userId')
    .sendStatus(204);
};

module.exports = { handleLogout };
