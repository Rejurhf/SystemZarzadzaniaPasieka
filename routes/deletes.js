
const express = require('express');
const Apiary = require('../core/apiary');
const router = express.Router();

const apiary = new Apiary();

// Delete Hive ---------------------------------------------------------------------------
router.delete('/apiary/hive/:hiveID', (req, res) => {
    let sUserID = req.session.user.ID; 
    console.log(['DELETE /apiary/hive/', req.params.hiveID]);
    
    if(sUserID)
        apiary.deleteHive(req.params.hiveID, function(result){
            if(result === 'SUCCESS_HIVE_FAMILY'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Ul i rodzina zostały usunięte`});
            }else if(result === 'SUCCESS_HIVE'){
                res.status(200).send({
                    isError: false, severity: 'Success', 
                    message: `Ul został usunięty`});
            }else{
                res.status(200).send({
                    isError: true, severity: 'Error', 
                        message: 'Nie można usunąć tego ula.'});
            }
        })
    else{
        res.json({});
    }
});

module.exports = router;

