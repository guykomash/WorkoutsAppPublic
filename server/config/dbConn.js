/* FROM MONGOOSE DOCS: 
useNewUrlParser - The underlying MongoDB driver has deprecated their current connection string parser. Because this is a major change, they added the useNewUrlParser flag to allow users to fall back to the old parser if they find a bug in the new parser. You should set useNewUrlParser: true unless that prevents you from connecting. Note that if you specify useNewUrlParser: true, you must specify a port in your connection string, like mongodb://localhost:27017/dbname. The new url parser does not support connection strings that do not have a port, like mongodb://localhost/dbname.

useUnifiedTopology - 
By default, mongoose.connect() will print out the below warning:

    Deprecation Warning: current Server Discovery and Monitoring engine is
    deprecated, and will be removed in a future version. To use the new Server
    Discover and Monitoring engine, pass option { useUnifiedTopology: true } to
    the MongoClient constructor.

Mongoose 5.7 uses MongoDB driver 3.3.x, which introduced a significant refactor of how it handles monitoring all the servers in a replica set or sharded cluster. In MongoDB parlance, this is known as server discovery and monitoring.
To opt in to using the new topology engine, use the below line:

mongoose.set('useUnifiedTopology', true);

mongoose.connection - 

connected: Emitted when Mongoose successfully makes its initial connection to the MongoDB server, or when Mongoose reconnects after losing connectivity.
open: Equivalent to connected

*/

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
