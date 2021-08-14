
const express = require('express');
const Apiary = require('../core/apiary');
const apiary = new Apiary();
const Logger = require('../core/logger');
const logger = new Logger();
const router = express.Router();


// Delete Apiary -------------------------------------------------------------------------
router.delete('/apiary/:apiaryID', (req, res) => {
    let sUserID = req.session.user.ID; 
    logger.consoleLog(new Date(), ['DELETE /apiary/', req.params.apiaryID]);
    
    if(sUserID)
        apiary.deleteApiary(req.params.apiaryID, function(result){
            if(result === 'SUCCESS_APIARY_HIVE'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Pasieka została usunięta`});
            }else if(result === 'SUCCESS_APIARY'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Pusta pasieka została usunięta`});
            }else{
                res.status(200).send({
                    isError: true, severity: 'Error', 
                        message: 'Nie można usunąć tej pasieki.'});
            }
        })
    else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
});

// Delete Group --------------------------------------------------------------------------
router.delete('/apiary/group/:groupID', (req, res) => {
    let sUserID = req.session.user.ID; 
    logger.consoleLog(new Date(), ['DELETE /apiary/group/', req.params.groupID]);
    
    if(sUserID)
        apiary.deleteGroup(req.params.groupID, function(result){
            if(result === 'SUCCESS_GROUP_HIVE_FAMILY'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Grupa z ulami i rodzinami została usunięta.`});
            }else if(result === 'SUCCESS_GROUP_HIVE'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Grupa z ulami została usunięta.`});
            }else if(result === 'SUCCESS_GROUP'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Pusta grupa została usunięta.`});
            }else{
                res.status(200).send({
                    isError: true, severity: 'Error', 
                        message: 'Nie można usunąć tej grupy.'});
            }
        })
    else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
});

// Delete Hive ---------------------------------------------------------------------------
router.delete('/apiary/hive/:hiveID', (req, res) => {
    let sUserID = req.session.user.ID; 
    logger.consoleLog(new Date(), ['DELETE /apiary/hive/', req.params.hiveID]);
    
    if(sUserID)
        apiary.deleteHive(req.params.hiveID, function(result){
            if(result === 'SUCCESS_HIVE_FAMILY'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Ul i rodzina zostały usunięte`});
            }else if(result === 'SUCCESS_HIVE'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Pusty Ul został usunięty`});
            }else{
                res.status(200).send({
                    isError: true, severity: 'Error', 
                        message: 'Nie można usunąć tego ula.'});
            }
        })
    else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
});

// Delete Family -------------------------------------------------------------------------
router.delete('/apiary/family/:familyID', (req, res) => {
    let sUserID = req.session.user.ID; 
    logger.consoleLog(new Date(), ['DELETE /apiary/family/', req.params.familyID]);
    
    if(sUserID)
        apiary.deleteFamily(req.params.familyID, function(result){
            if(result === 'SUCCESS_FAMILY'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Rodzina została usunięta.`});
            }else{
                res.status(200).send({
                    isError: true, severity: 'Error', 
                        message: 'Nie można usunąć tej rodziny.'});
            }
        })
    else{
        logger.consoleLog(new Date(), ['post /apiary:', 'User not authorized']);
        res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
    }
});

module.exports = router;

