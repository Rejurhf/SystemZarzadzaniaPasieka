
const express = require('express');
const router = express.Router();
const Logger = require('../core/logger');
const logger = new Logger();


// Login ---------------------------------------------------------------------------------
// Get index page
router.get('/', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.redirect('/home');
        return;
    }

    res.render('index', {title:"Pasieka"});
})

// Get loggout page
router.get('/loggout', (req, res, next) => {
    let user = req.session.user;

    if(user){
        req.session.destroy(function(){
            res.redirect('/');
        })
    }
});

// Home ----------------------------------------------------------------------------------
// Get Home page 
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.render('home/home', {name:user.FirstName});
        return;
    }
    res.redirect('/');
})

// Apiary --------------------------------------------------------------------------------
// Get Apiary page 
router.get('/apiary', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.render('apiary/apiary', {name:user.FirstName});
        return;
    }
    res.redirect('/');
})

// Go to Hive page
router.get('/apiary/hive/:hiveId', (req, res, next) => {
    let user = req.session.user;
    logger.consoleLog(new Date(), ['GET /apiary/hive/', req.params.hiveId]);

    if(user){
        res.render('apiary/hive', {hiveID:req.params.hiveId});
        return;
    }
    res.redirect('/');
})

// Actions -------------------------------------------------------------------------------
// Get Actions page 
router.get('/actions', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.render('actions/actions', {name:user.FirstName});
        return;
    }
    res.redirect('/');
})

// Info -------------------------------------------------------------------------------
// Get Info page 
router.get('/info', (req, res, next) => {
    let user = req.session.user;

    if(user){
        res.render('info/info', {name:user.FirstName});
        return;
    }
    res.redirect('/');
})

module.exports = router;


