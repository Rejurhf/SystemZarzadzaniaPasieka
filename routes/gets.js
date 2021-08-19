
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
router.post('/familyattributes', (req, res) => {
    let sUser = req.session.user; 
    if(!Array.isArray(req.body['name[]'])){
        req.body['name[]'] = [req.body['name[]']];
        req.body['type[]'] = [req.body['type[]']];
    }
    logger.consoleLog(new Date(), ['GET /familyattributes', req.body]);
    
    if(sUser){
        apiary.getFamilyAttributesForPopup(req.body, function(result){
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
    let sUser = req.session.user;
    logger.consoleLog(new Date(), ['GET /groups', req.body]);
    
    if(sUser){
        if(apiaryID && apiaryID != ''){
            apiary.getUserHiveGroups(parseInt(apiaryID), function(result){
                res.json(result);
            })
        }else{
            apiary.getUserApiaries(sUser.ID, function(result){
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

// Get free Hives for group
router.post('/hives', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    let groupID = req.body.groupID; 
    let sUserID = req.session.user.ID;
    
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
        logger.consoleLog(new Date(), ['GET /hives:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get occupied Hives for group
router.post('/occupiedhives', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    let groupID = req.body.groupID; 
    let sUserID = req.session.user.ID;
    
    logger.consoleLog(new Date(), ['GET /occupiedhives', apiaryID, groupID]);
    
    if(sUserID){
        if(apiaryID && apiaryID != ''){
            apiary.getOccupiedUserHives(parseInt(apiaryID), parseInt(groupID), function(result){
                logger.consoleLog(new Date(), ['GET /hives', result]);
                if(result)
                    res.json(result);
                else
                    res.json({});
            })
        }else{
            apiary.getUserApiaries(sUserID, function(result){
                if(result.length){
                    apiary.getOccupiedUserHives(result[0].ID, parseInt(groupID), function(result){
                        res.json(result);
                    })
                }else
                    res.json({});
            })
        }
    }else{
        logger.consoleLog(new Date(), ['GET /hives:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Hive list with families, groups and apiaries
router.post('/hivelist', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID){
        apiary.getHiveList(sUserID, function(result){
            logger.consoleLog(new Date(), ['GET /hivelist', 'SUCCESS']);
            res.json(apiary.formatHiveListToJSON(result));
        })
    }else{
        logger.consoleLog(new Date(), ['GET /hivelist:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Get Family list
router.get('/apiary/familylist', (req, res) => {
    let sUser = req.session.user; 
    
    if(sUser){
        apiary.getUserFamilyList(sUser.ID, function(result){
            logger.consoleLog(new Date(), ['GET /apiary/familylist', result]);
            if(result)
                res.json(result);
            else
                res.json({});
        })
    }else{
        logger.consoleLog(new Date(), ['GET /apiary/familylist:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
})

// Helper functions



module.exports = router;
