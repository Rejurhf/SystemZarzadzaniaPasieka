
const express = require('express');
const Apiary = require('../core/apiary');
const apiary = new Apiary();
const Logger = require('../core/logger');
const logger = new Logger();
const router = express.Router();


// Apiary GET ----------------------------------------------------------------------------
router.get('/apiaries', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID)
        apiary.getUserApiaries(sUserID, function(result){
            res.json(result);
        })
    else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Family Attributes
router.get('/familyattributes', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID){
        apiary.getFamilyAttributesForPopup(function(result){
            res.json(result);
        })
    }else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Hive groups
router.post('/groups', (req, res) => {
    let apiaryID = req.body.apiaryID;
    let sUserID = req.session.user.ID;
    logger.consoleLog(new Date(), ['GET /groups', req.body]);
    
    if(sUserID){
        if(apiaryID && apiaryID != ''){
            apiary.getUserHiveGroups(parseInt(apiaryID), function(result){
                res.json(result);
            })
        }else{
            apiary.getUserApiaries(sUserID, function(result){
                if(result && result.length){
                    apiary.getUserHiveGroups(result[0].ID, function(result){
                        res.json(result);
                    })
                }else
                    res.json({})
            })
        }
    }else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Hives for group
router.post('/hives', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    let groupID = req.body.groupID; 
    let sUserID = req.session.user.ID;
    
    let curDateTime = new Date();
    logger.consoleLog(new Date(), curDateTime.toLocaleString(), '--------------------------------');
    logger.consoleLog(new Date(), ['GET /hives', apiaryID, groupID]);
    
    
    if(sUserID){
        if(apiaryID && apiaryID != ''){
            apiary.getFreeUserHives(parseInt(apiaryID), parseInt(groupID), function(result){
                logger.consoleLog(new Date(), ['GET /hives', result]);
                if(result)
                    res.json(result);
                else
                    res.json({});
            })
        }else{
            apiary.getUserApiaries(sUserID, function(result){
                if(result.length){
                    apiary.getFreeUserHives(result[0].ID, parseInt(groupID), function(result){
                        res.json(result);
                    })
                }else
                    res.json({});
            })
        }
    }else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Hive list with families, aroups and apiaries
router.post('/hivelist', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID){
        apiary.getHiveList(sUserID, function(result){
            res.json(apiary.formatHiveListToJSON(result));
        })
    }else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Helper functions



module.exports = router;
