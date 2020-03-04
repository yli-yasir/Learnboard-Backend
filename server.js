require('dotenv').config();

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const {handleMongooseError} = require('./middleware/errors')
const chalk = require("chalk");

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(()=>{console.log(chalk.blueBright('Connected to MongoDB!'))})
.catch(()=>{console.error(chalk.red('MongoDB connection error!'))});

app.use(cookieParser());
app.use(express.json());

app.use('/posts',require('./routes/posts'));
app.use('/reports',require('./routes/reports'));
app.use('/users',require('./routes/users'));
app.get('/',(req,res)=>res.send('root'));

app.use(handleMongooseError);


app.listen(process.env.PORT,()=> console.log(chalk.blueBright(`Listening @ ${process.env.PORT}`)));
