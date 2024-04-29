const User = require('../models/user');
const { format } = require('date-fns');
// hash passwords
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd, firstName, lastName } = req.body;
  console.log(req.body);
  if (!user || !pwd || !firstName || !lastName)
    return res.status(400).json({ message: 'all Users fields required' });

  // check for duplicates usernames in db (username registered is already exists.)
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // 409 = Conflict

  try {
    //ecnrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10); // salt is 10.

    // Create and store new user
    const result = User.create({
      username: user,
      password: hashedPwd,
      name: {
        firstname: firstName,
        lastname: lastName,
      },
      created: format(new Date(), 'dd/MM/YYY'),
    });

    console.log(result);

    res.status(201).json({ message: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message }); // 500 - server error
  }
};

module.exports = { handleNewUser };
