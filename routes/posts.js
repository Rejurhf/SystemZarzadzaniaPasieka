
const express = require('express');
const User = require('../core/user');
const Apiary = require('../core/apiary');
const e = require('express');
const router = express.Router();

const user = new User();
const apiary = new Apiary();

// Login posts ---------------------------------------------------------------------------
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
    // let userInput = {
    //     firstName: 'Rejurhf',
    //     lastName: 'Rejurhf',
    //     userNo: 'Rejurhf',
    //     password: 'ac4dc',
    //     active: 1,
    //     createdBy: 'Rejurhf',
    //     lastUpdatedBy: 'Rejurhf'
    // };
    
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

// Apiary inserts ------------------------------------------------------------------------
router.post('/apiary', (req, res) => {
    let user = req.session.user;

    apiary.createApiary(req.body.apiaryName, req.body.apiaryCreationDate, user.UserNo, 
            function(lastID){
        if(lastID === 'Apiary already exists'){
            console.log('Apiary already exists.');
        }else if(lastID){
            console.log(`Apiary added ${req.body.apiaryName}`);
        }else{
            console.log('Failed to add apiary.');
        }
        res.end();
    })
})

module.exports = router;
