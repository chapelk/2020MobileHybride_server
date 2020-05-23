var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Alert = new Schema({
    range: {
        type: Number,
        default: 1000,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
});

module.exports = mongoose.model('Alert', Alert);
