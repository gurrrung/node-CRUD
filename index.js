const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodecrud')
let db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Checking db errors
db.on('error', function (error) {
    console.log(error);
});

// Init app
const app = express();

// Bring in `em models ;)
let Article = require('./models/article');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', function( request, response) {
    Article.find({}, function ( error, articles) {
        if (error) {
            console.log(error);
        } else {
            response.render('index', {
                title: 'Hello',
                articles: articles
            });
        }
    })
})

// Add articles route
app.get('/add', function ( request, response) {
    response.render('add', {
        title: 'Add Stuff'
    })
})

// Start server
app.listen(8100, function() {
    console.log('Server started on port: 8100');
})