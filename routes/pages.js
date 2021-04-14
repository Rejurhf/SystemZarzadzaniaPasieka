
const express = require('express');
const User = require('../core/user');
const router = express.Router();

const fs = require('fs');

const user = new User();

// Get index page
router.get('/', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.redirect('/home');
        return;
    }

    res.render('index', {title:"Pasieka"});
})

// Get Home page 
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.render('home/home', {opp:req.session.opp, name:user.FirstName});
        return;
    }
    res.redirect('/');
})

// Post login data
router.post('/login', (req, res, next) => {
    user.login(req.body.username, req.body.password, function(result){
        if(result){
            req.session.user = result;
            req.session.opp = 1;

            res.redirect('/home');
        }else{
            res.send('Username/Password uncorrect!');
        }
    })
});

// Post registe data
router.post('/register', (req, res, next) => {
    let userInput = {
        firstName: 'Rejurhf',
        lastName: 'Rejurhf',
        userNo: 'Rejurhf',
        password: 'ac4dc',
        active: 1,
        createdBy: 'Rejurhf',
        lastUpdatedBy: 'Rejurhf'
    };
    
    user.create(userInput, function(lastID){
        if(lastID){
            user.find(lastID, function(result){
                req.session.user = result;
                req.session.opp = 0;
                
                res.redirect('/home');
            })
        }else{
            console.log('Error creating a new user...');
        }
    })
});

// Get loggout page
router.get('/loggout', (req, res, next) => {
    if(req.session.user){
        req.session.destroy(function(){
            res.redirect('/');
        })
    }
});

module.exports = router;

