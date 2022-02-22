const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('connection successful!'));
const app = require('./index');

const port = process.env.port || 5000;
app.listen(port, () => {
  //   console.log(`app runing on port ${port}`);
});
