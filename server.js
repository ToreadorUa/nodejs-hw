const app = require('./app')
const mongoose = require('mongoose') // library for connection with MongoDB

const { DB_HOST, PORT = 3000 } = process.env;    // take DB_HOST from environment variables

// mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful...');
    app.listen(PORT)
  })    // if DB connected successful - start server with port 3000
  .catch(err => {
    console.log(err.message);
  process.exit(1)                // exit with undefined error
  })


