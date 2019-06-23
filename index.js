const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

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

// Express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express validator middleware
// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

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

    request.checkBody('title', 'Title is required').notEmpty();
    request.checkBody('author', 'Author is required').notEmpty();
    request.checkBody('body', 'Body is required').notEmpty();

    // Get errors
    let errors = request.validationErrors();

    if (errors) {
        response.render('add', {
            title: 'Add article',
            errors: errors
        });
    } else {

        let article = new Article();
        article.title = request.body.title;
        article.author = request.body.author;
        article.body = request.body.body;
        
        article.save(function(error) {
            if(error) {
                console.log(error);
                return;
            } else {
                request.flash('success', 'Article Added')
                response.redirect('/');
            }
        })
    };
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
            request.flash('success', 'Article Updated')
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