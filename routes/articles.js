const express = require('express');
const router = express.Router();

// Bring in `em models ;)
let Article = require('../models/article');

// Get single article
router.get('/view/:id', function( request, response) {
    Article.findById(request.params.id, function( error, article) {
        response.render('article', {
            article: article
        })
    })
})

// Add get articles route
router.get('/add', function ( request, response) {
    response.render('add', {
        title: 'Add Stuff'
    })
});

// Add post articles route
router.post('/add', function( request, response) {

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
});

// Load edit form
router.get('/edit/:id', function( request, response) {
    Article.findById(request.params.id, function( error, article) {
        response.render('edit', {
            title: 'Edit Page',
            article: article
        })
    })
})

// Add edit articles route
router.post('/edit/:id', function( request, response) {

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
router.delete('/delete/:id', function( request, response) {
    let query = {_id: request.params.id}

    Article.remove(query, function(error) {
        if (error) {
            console.log(error);
        }
        response.send('success');
    })
})

module.exports = router;