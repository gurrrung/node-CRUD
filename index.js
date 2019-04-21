const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

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

// Add get articles route
app.get('/add', function ( request, response) {
    response.render('add', {
        title: 'Add Stuff'
    })
})

// Add post articles route
app.post('/add', function( request, response) {
    let articles = new Article();
    articles.title = request.body.title;
    articles.author = request.body.author;
    articles.body = request.body.body;
    
    articles.save(function(error) {
        if(error) {
            console.log(error);
            return;
        } else {
            response.redirect('/');
        }
    })
})


// Start server
app.listen(8100, function() {
    console.log('Server started on port: 8100');
})