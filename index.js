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

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

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
});

// Get single article
app.get('/view/:id', function( request, response) {
    Article.findById(request.params.id, function( error, article) {
        response.render('article', {
            article: article
        })
    })
})

// Add get articles route
app.get('/add', function ( request, response) {
    response.render('add', {
        title: 'Add Stuff'
    })
});

// Add post articles route
app.post('/add', function( request, response) {
    let article = new Article();
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;
    
    article.save(function(error) {
        if(error) {
            console.log(error);
            return;
        } else {
            response.redirect('/');
        }
    })
})

// Load edit form
app.get('/edit/:id', function( request, response) {
    Article.findById(request.params.id, function( error, article) {
        response.render('edit', {
            title: 'Edit Page',
            article: article
        })
    })
})

// Add edit articles route
app.post('/edit/:id', function( request, response) {

    let article = {};
    article.title = request.body.title;
    article.author = request.body.author;
    article.body = request.body.body;

    let query = {_id: request.params.id}
    
    Article.update(query, article, function(error) {
        if(error) {
            console.log(error);
            return;
        } else {
            response.redirect('/');
        }
    })
})

// Deleting a article
app.delete('/delete/:id', function( request, response) {
    let query = {_id: request.params.id}

    Article.remove(query, function(error) {
        if (error) {
            console.log(error);
        }
        response.send('success');
    })
})

// Start server
app.listen(8100, function() {
    console.log('Server started on port: 8100');
})