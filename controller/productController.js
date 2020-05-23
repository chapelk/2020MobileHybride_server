
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
            // product.distance = getDistanceFromLatLonInKm(lat, long, product.lat, product.long);
            product.distance = 50;
            return product;
        });
        return res.status(200).send(products);
    });
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

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
