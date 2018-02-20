var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app = express();

var userModel = require('./models/models');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/HireViewdb',{
    //useMongoClient : true,
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var routes = require('./routes/routes');
routes(app);

app.listen(3000);
console.log('listen on port 3000');
