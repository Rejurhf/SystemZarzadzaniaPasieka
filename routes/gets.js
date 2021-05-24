
const express = require('express');
const Apiary = require('../core/apiary');
const router = express.Router();

const apiary = new Apiary();

// Apiary GET ----------------------------------------------------------------------------
router.get('/apiaries', (req, res) => {
    let sUserID = req.session.user.ID; 
    
    if(sUserID)
        apiary.findUserApiaries(sUserID, function(result){
            res.json(result);
        })
    else{
        res.json({})
    }
})

router.get('/groups', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    
    if(apiaryID)
        apiary.findUserHiveGroups(apiaryID, function(result){
            res.json(result);
        })
    else{
        res.json({})
    }
})

router.get('/hives', (req, res) => {
    let apiaryID = req.body.apiaryID; 
    let groupID = req.body.groupID; 
    
    if(apiaryID)
        apiary.findUserHives(apiaryID, groupID, function(result){
            res.json(result);
        })
    else{
        res.json({})
    }
})


module.exports = router;
