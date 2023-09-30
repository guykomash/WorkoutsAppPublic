const User = require('../models/User');

const jwt = require('jsonwebtoken');

const jwtDecode = require('jwt-decode');
// grab refreshToken from cookies.
// grab user from DB by the refreshToken.
// verify refreshToken => sign new accessToken & send to user.
const handleRefreshToken = async (req, res) => {
  console.log('handleRefreshToken');
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  // console.log(refreshToken);

  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) return res.sendStatus(403); // 403 = foribdden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.message === 'jwt expired') {
        console.log('expired');
        return res.sendStatus(401);
      } else return res.sendStatus(403);
    } else if (foundUser.username !== decoded.username) {
      return res.sendStatus(403);
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    res.send({
      userId: foundUser._id,
      userName: foundUser.username,
      userFirstName: foundUser.name.firstname,
      userLastName: foundUser.name.lastname,
      created: foundUser.created,
      accessToken,
    });
  });
};

module.exports = { handleRefreshToken };
