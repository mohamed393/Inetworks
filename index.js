const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const authUser = require('./routes/auth');
const eventRouter = require('./routes/event');

const app = express();
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/auth', authUser);
app.use('/api/event', eventRouter);

mongoose.connect('mongodb://localhost/events', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('database server connected') })
    .catch((error) => { console.log(error.message) });

app.listen(3000, () => {
    console.log('Server Started At Port 3000')
})      