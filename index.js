var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    Category = require('./models/category');
    User = require('./models/user');
    Product = require('./models/product');
    Alert = require('./models/alert');
    bodyParser = require('body-parser');
    cookieParser = require('cookie-parser')

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


var routes = require('./routes/routes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Server started on: ' + port);
