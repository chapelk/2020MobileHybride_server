
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Category = mongoose.model('Category'),
    Product = mongoose.model('Product'),
    config = require('../config'),
    jwt = require("jsonwebtoken");
var cookies = require("cookie-parser");


exports.get = function(req, res) {
    const {range, lat, long, category} = req.body;
    Product.find().lean().exec(function (err, products) {
        products.map(product => {
            product.distance = 50; // TODO METTRE BON CALCUL
            return product;
        });
        return res.status(200).send(products);
    });
};

exports.add =  function(req, res) {
    const {name, price, lat, long, description, category, lieu} = req.body;
    const token = req.cookies.token;
    var payload;
    if (!token) {
        return res.status(401).send({error: "Vous n'êtes pas connecté"})
    } else if (!name || !price || !lat || !long) {
        return res.status(401).send({error: "Merci de remplir tout les champs"})
    }
    try {
        payload = jwt.verify(token, config.privateKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({error: "Vous n'êtes pas connecté"})
        }
        return res.status(400).end()
    }
    User.findOne({pseudo: payload.pseudo}).then(function (user) {
        Category.findOne({apiId: category}).then(function(cat) {
            var product = new Product({
                name: name,
                price: price,
                description: description,
                lat: lat,
                long: long,
                user: user._id,
            });
            user.lat = lat;
            user.long = long;
            user.save().then(function() {
                product.save().then(function() {
                    return res.status(200).send("OK");
                });
            });
        });
    });
};
