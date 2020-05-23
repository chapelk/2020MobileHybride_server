var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        default: 48.8,
    },
    long: {
        type: Number,
        default: 2.2,
    }
});

module.exports = mongoose.model('User', User);
