require('dotenv').config(); // allowing the usage of process.env
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3080;
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// a Printing middlware - for debugging.
app.use(require('./middleware/printRequset'));

app.use('/register', require('./routes/registerRoute'));
app.use('/auth', require('./routes/authRoute'));
app.use('/refresh', require('./routes/refreshRoute'));
app.use('/logout', require('./routes/logoutRoute'));

app.use(verifyJWT); // from now on (waterfall...)
app.use('/myaccount', require('./routes/accountRoute'));
app.use('/workouts', require('./routes/workoutsRoute'));
app.use('/sessions', require('./routes/sessionsRoute'));
app.use('/exercises', require('./routes/exercisesRoute'));
app.use('/admin', require('./routes/adminRoute'));

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
