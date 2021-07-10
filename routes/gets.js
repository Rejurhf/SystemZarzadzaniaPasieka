
const express = require('express');
const Apiary = require('../core/apiary');
const router = express.Router();

const apiary = new Apiary();

// Apiary GET ----------------------------------------------------------------------------
router.get('/apiaries', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID)
        apiary.getUserApiaries(sUserID, function(result){
            res.json(result);
        })
    else{
        res.json({});
    }
})

// Get Hive groups
router.post('/groups', (req, res) => {
    let apiaryID = req.body.apiaryID;
    let sUserID = req.session.user.ID;
    console.log(['GET /groups', req.body]);
    
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
})

// Get Hives for group
router.post('/hives', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    let groupID = req.body.groupID; 
    let sUserID = req.session.user.ID;
    console.log(['GET /hives', apiaryID, groupID]);
    
    if(apiaryID && apiaryID != ''){
        apiary.getFreeUserHives(parseInt(apiaryID), parseInt(groupID), function(result){
            console.log(['Get /hives', result]);
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
})

// Get Hive list with families, aroups and apiaries
router.post('/hivelist', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID)
        apiary.getHiveList(sUserID, function(result){
            res.json(result);
        })
    else{
        res.json({});
    }
})




module.exports = router;
