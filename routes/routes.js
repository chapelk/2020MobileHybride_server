var userController = require('../controller/userController');
var alertController = require('../controller/alertController');
var categoryController = require('../controller/categoryController');
var productController = require('../controller/productController');

module.exports = function (app) {
    /* --------------- User --------------------- */

    app.post("/login", function (req, res) {
       return userController.login(req, res);
    });

    app.post("/register", function (req, res) {
        return userController.register(req, res);
    });

    app.put("/user", function (req, res) {
        return userController.update(req, res);
    });

    app.post("/logout", function (req, res) {
        return userController.logout(req, res);
    });

    /* --------------- Products --------------------- */

    app.get("/products", function (req, res) {
        return productController.get(req, res);
    });

    app.post("/products", function (req, res) {
        return productController.add(req, res);
    });

    /* --------------- Alerts --------------------- */

    app.get("/alerts", function (req, res) {
        return alertController.get(req, res);
    });

    app.post("/alerts", function (req, res) {
        return alertController.add(req, res);
    });

    /* --------------- Categories --------------------- */

    app.get("/categories", function (req, res) {
        return categoryController.get(req, res);
    });

};
