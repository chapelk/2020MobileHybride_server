
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    bcrypt = require('bcrypt'),
    config = require('../config'),
    jwt = require("jsonwebtoken");
var cookies = require("cookie-parser");

var login = exports.login = async function(req, res) {
    if (!req.body.password || !req.body.pseudo) {
        return res.status(401).send({ error: "Merci de remplir tout les champs" });
    }
    const { pseudo, password } = req.body;
    var user = await User.findOne({ pseudo: pseudo });
    if (!user) {
        return res.status(401).send({ error: "Ce pseudo n'existe pas" });
    }
    bcrypt.compare(password, user.password).then(function(result) {
        if (result) {
            const token = jwt.sign({ pseudo }, config.privateKey, {
                algorithm: "HS256",
                expiresIn: 600000,
            });
            res.cookie("token", token, { maxAge: 600000 * 1000 });
            return res.status(200).end();
        } else {
            return res.status(401).send({ error: "Le mot de passe ne correspond pas" });
        }
    });
};

var register = exports.register = async function(req, res) {
    console.log("REGISTER");
    if (!req.body.password || !req.body.pseudo || !req.body.passwordConf ) {
        return res.status(401).send({ error: "Merci de remplir tout les champs" });
    }
    else if (req.body.password !== req.body.passwordConf) {
        return res.status(401).send({ error: "Les mots de passes ne correspondent pas" });
    }

    if (await User.findOne({pseudo: req.body.pseudo })) {
        return res.status(401).send({ error: "Ce pseudo est déjà pris" });
    }
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        var user = new User({
            pseudo: req.body.pseudo,
            password: hash,
            lat: req.body.lat,
            long: req.body.long,
        });
        user.save().then(async function() {
            return await login(req, res);
        });
    });
};

exports.update = async function(req, res) {
    const {lat, long} = req.body;
    const token = req.cookies.token;
    var payload;
    if (!token) {
        return res.status(401).send({error: "Vous n'êtes pas connecté"})
    } else if (!lat || !long) {
        return res.status(401).send({error: "missing parameters"})
    }
    try {
        payload = jwt.verify(token, config.privateKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({error: "Vous n'êtes pas connecté"})
        }
        return res.status(400).end()
    }
    await User.find({pseudo: payload.pseudo}, function(err, users) {
        var user = users[0];
        if (!user) {
            return res.status(500).send({ error: "Unknown error" });
        }
        user.lat = lat;
        user.long = long;
        user.save().then(function() {
            return res.status(200).send("OK");
        });
    });
};

exports.logout = async function(req, res) {
    const token = req.cookies.token;
    jwt.destroy(token);
    res.status(200).end();
};
