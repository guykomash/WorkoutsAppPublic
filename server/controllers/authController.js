const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required' });

  //try to find user in db
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401);

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //.filter(Boolean) check
    const roles = Object.values(foundUser.roles);
    // console.log(roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //updating DB users: update the logged in user with his refreshToken

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res
      .cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie('userId', foundUser._id) // check to cancel.
      .send({
        userId: foundUser._id,
        userName: foundUser.username,
        userFirstName: foundUser.name.firstname,
        userLastName: foundUser.name.lastname,
        created: foundUser.created,
        accessToken,
      });
  } else {
    // passwords don't match
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
