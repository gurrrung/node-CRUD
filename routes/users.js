const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Brink in models
let User = require('../models/user');

// Register form
router.get('/register', function(request, response) {
    response.render('register');
});

// Register process
router.post('/register', function(request, response) {
    const name = request.body.name;
    const email = request.body.email;
    const username = request.body.username;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    request.checkBody('name', 'Name is required').notEmpty();
    request.checkBody('email', 'Email is required').notEmpty();
    request.checkBody('email', 'Email is not valid').isEmail();
    request.checkBody('username', 'Username is required').notEmpty();
    request.checkBody('password', 'Password is required').notEmpty();
    request.checkBody('password_confirm', 'Password confirmation is required').notEmpty();
    request.checkBody('password_confirm', 'Passwords do not match').equals(request.body.password);
    
    let errors = request.validationErrors();

    if(errors) {
        response.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, function(error, salt) {
            bcrypt.hash(newUser.password, salt, function(error, hash) {
                if(error) {
                    console.log(error);
                }
                newUser.password = hash;
                newUser.save(function(error) {
                    if(error) {
                        console.log(error);
                    } else {
                        request.flash('success', 'You are now registered and can log in');
                        response.redirect('/users/login');
                    }
                })
            });
        })
    }
});

router.get('/login', function(request, response) {
    response.render('login');
})

module.exports = router;