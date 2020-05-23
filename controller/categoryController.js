
var mongoose = require('mongoose'),
    Category = mongoose.model('Category');

exports.get = function(req, res) {
    Category.find(function (err, categories) {
        return res.status(200).send(categories);
    });
};

