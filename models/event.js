const mongoose = require('mongoose');
const User = require('../models/user');
const eventSchema = new mongoose.Schema({
    name: String
    , attendance: Boolean
    , date: Date
    , user: [{
        type: mongoose.Schema.Types.ObjectId
        , ref: 'user'
    }]
});

const Event = mongoose.model('event', eventSchema);
module.exports = Event;
