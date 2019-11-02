require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const db = mongoose.connection;

db.on('error', ()=>{console.error('mongo connection error!')});

db.once('open', ()=>{console.log('connected to mongo!')});

mongoose.connect(process.env.MONGO_CONNECTION_STRING);

app.use('/api/posts',postsRouter);

app.get('/',(req,res)=>res.send('root'));

app.listen(process.env.PORT,()=> console.log(`listening @ ${process.env.PORT}`));
