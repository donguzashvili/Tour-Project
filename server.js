const mongoose = require('mongoose');

const dotenv = require('dotenv');

//global unhandled rejection handle(sync code)
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('connection successful!'));
const app = require('./index');

const port = process.env.port || 5000;
const server = app.listen(port, () => {
  //   console.log(`app runing on port ${port}`);
});

//global unhandled rejection handle(async code)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
