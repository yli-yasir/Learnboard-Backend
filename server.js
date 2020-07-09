require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const prettyLogger = require('./utils/prettyLogger');
const db = require('./db/driver');
const {errorHandlers} = require('./middleware/errorHandlers');

db.connectToMongo(process.env.DB_URI);

app.use(cookieParser());
app.use(express.json());
app.use(errorHandlers);

app.use('/posts', require('./routes/posts'));
app.use('/reports', require('./routes/reports'));
app.use('/users', require('./routes/users'));

const listener = app.listen(process.env.PORT, () =>
  prettyLogger.logInfo(
    `Server has started! Listening at port ${listener.address().port}.`
  )
);
