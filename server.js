var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app = express();



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/HireViewdb',{
    //useMongoClient : true,
});
//var userModel = require('./models/models.js');
//mongoose.model('seekerModel');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var userModel = require('./models/models');
var routes = require('./routes/routes');
routes(app);

app.listen(3000);
console.log('listen on port 3000');
