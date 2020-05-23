
var mongoose = require('mongoose'),
    Alert = mongoose.model('Alert'),
    User = mongoose.model('User'),
    Category = mongoose.model('Category'),
    config = require('../config'),
    jwt = require("jsonwebtoken");
var cookies = require("cookie-parser");


exports.get = function(req, res) {
    const token = req.cookies.token;
    var payload;

    if (!token) {
        return res.status(401).send({error: "Vous n'êtes pas connecté"})
    }
    try {
        payload = jwt.verify(token, config.privateKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({error: "Vous n'êtes pas connecté"})
        }
        return res.status(400).end()
    }
    User.findOne({pseudo: payload.pseudo}).then(function(user) {
        console.log(user._id);
        const alerts = Alert.find({user: user._id})
            .populate('category', '-_id')
            .select('user category range').then(function(alerts) {
                return res.status(200).send(alerts);
            });
    });
};

exports.add =  function(req, res) {
    const {category, range, lat, long} = req.body;
    const token = req.cookies.token;
    var payload;
    if (!token) {
        return res.status(401).send({error: "Vous n'êtes pas connecté"})
    }
    try {
        payload = jwt.verify(token, config.privateKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({error: "Vous n'êtes pas connecté"})
        }
        return res.status(400).end()
    }
    User.findOne({pseudo: payload.pseudo}).then(function(user) {
        Category.findOne({apiId: category}).then(function(cat) {
            var alert = new Alert({
                range: range,
                user: user._id,
                category: cat._id,
            });
            alert.save().then(function() {
                return res.status(200).send("OK");
            });
        });
    });

};
