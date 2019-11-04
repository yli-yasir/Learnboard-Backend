require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
.then(()=>{console.log('connected to mongo!')})
.catch(()=>{console.error('mongo connection error!')});

app.use(express.json())

app.use('/api/posts',require('./routes/posts'));
app.use('/api/reports',require('./routes/reports'));
app.use('/api/users',require('./routes/users'));
app.get('/',(req,res)=>res.send('root'));

app.listen(process.env.PORT,()=> console.log(`listening @ ${process.env.PORT}`));
