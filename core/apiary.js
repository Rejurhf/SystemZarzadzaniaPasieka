
const pool = require('./pool');
const Logger = require('../core/logger');
const logger = new Logger();

function Apiary(){};

Apiary.prototype = {
    // Helper functions ------------------------------------------------------------------
    formatHiveListToJSON: function(data){
        if(data && data.length){
            // Apiary array to JSON
            let curApiaryID = data[0]['ApiaryID'];
            let curGroupID = data[0]['GroupID'];
            let apiaryList = [];
            let groupList = [];
            let hiveList = [];
            for(let i = 0; i < data.length; ++i){
                curItem = data[i];
                if(curItem["ApiaryID"] === curApiaryID){
                    if(curItem['GroupID'] === curGroupID){
                        // Create new Hive and add to list
                        if(curItem['HiveID']){
                            let hive = {
                                'HiveID': curItem['HiveID'],
                                'HiveNum': curItem['HiveNum'],
                                'FamilyID': curItem['FamilyID']
                            }
                            hiveList.push(hive);
                        }
                    }else{
                        // Create new Group with Hives
                        prevItem = data[i-1];
                        let groupDict = {
                            'GroupID': prevItem['GroupID'],
                            'GroupName': prevItem['GroupName'],
                            'HiveList': hiveList
                        }
                        groupList.push(groupDict);

                        // Empty Hive list and add new Hive to empty List
                        hiveList = [];
                        let hive = {
                            'HiveID': curItem['HiveID'],
                            'HiveNum': curItem['HiveNum'],
                            'FamilyID': curItem['FamilyID']
                        }
                        hiveList.push(hive);

                        // Update cur values
                        curGroupID = curItem['GroupID'];
                    }
                }else{
                    prevItem = data[i-1];
                    // Create new Group with Hives
                    let groupDict = {
                        'GroupID': prevItem['GroupID'],
                        'GroupName': prevItem['GroupName'],
                        'HiveList': hiveList
                    }
                    groupList.push(groupDict);

                    // Create new Apiary with Groups
                    let apiaryDict = {
                        'ApiaryID': prevItem['ApiaryID'],
                        'ApiaryName': prevItem['ApiaryName'],
                        'GroupList': groupList
                    }
                    apiaryList.push(apiaryDict);

                    //Empty Group and Hive list and add new Hive to empty List
                    groupList = [];
                    hiveList = [];
                    if(curItem['HiveID']){
                        let hive = {
                            'HiveID': curItem['HiveID'],
                            'HiveNum': curItem['HiveNum'],
                            'FamilyID': curItem['FamilyID']
                        }
                        hiveList.push(hive);
                    }

                    // Update cur values
                    curApiaryID = curItem['ApiaryID'];
                    curGroupID = curItem['GroupID'];
                }
            }
            // Finishapiaries after loop
            lastItem = data[data.length - 1];
            // Create new Group with Hives
            let groupDict = {
                'GroupID': lastItem['GroupID'],
                'GroupName': lastItem['GroupName'],
                'HiveList': hiveList
            }
            groupList.push(groupDict);

            // Create new Apiary with Groups
            let apiaryDict = {
                'ApiaryID': lastItem['ApiaryID'],
                'ApiaryName': lastItem['ApiaryName'],
                'GroupList': groupList
            }
            apiaryList.push(apiaryDict);

            return(apiaryList);
        }
    },

    // Get -------------------------------------------------------------------------------
    getApiaries: function(callback){
        let sql = `SELECT Name FROM apiary WHERE Active = 1`;

        pool.query(sql, user, function(err, result) {
            if(err) 
                throw err;

            if(result.length) {
                callback(result);
            }else{
                callback(null);
            }
        });
    },

    getUserApiaries: function(userID, callback){
        let sql = `SELECT A.ID, A.Name
                    FROM user_apiary UA
                        JOIN apiary A
                            ON A.ID = UA.ApiaryID
                            AND A.Active = 1
                    WHERE UA.UserID = ?
                    ORDER BY A.Name`

        pool.query(sql, userID, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        });
    },

    getUserHiveGroups: function(apiaryID, callback){
        let sql = `SELECT HG.ID, HG.Name
                    FROM hive_group HG
                    WHERE HG.ApiaryID = ?
                        AND HG.Active = 1
                    ORDER BY HG.Name`;

        pool.query(sql, apiaryID, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    getUserHives: function(apiaryID, groupID, callback){
        let inGroupID = groupID ? groupID : 0;

        let sql = `SELECT H.ID, H.Number
                    FROM hive H
                    WHERE H.ApiaryID = ?
                        AND ((H.GroupID IS NULL AND ? < 1)
                            OR H.GroupID = ?)
                        AND H.Active = 1
                    ORDER BY H.Number`

        let bind = [apiaryID, inGroupID, inGroupID];

        pool.query(sql, bind, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    getFreeUserHives: function(apiaryID, groupID, callback){
        let inGroupID = groupID ? groupID : 0;

        let sql = `SELECT H.ID, H.Number
                FROM hive H
                    LEFT JOIN family F
                        ON F.HiveID = H.ID
                        AND F.Active = 1
                WHERE H.ApiaryID = ?
                    AND ((H.GroupID IS NULL AND ? < 1)
                        OR H.GroupID = ?)
                    AND F.ID IS NULL
                    AND H.Active = 1
                ORDER BY H.Number`

        let bind = [apiaryID, inGroupID, inGroupID];

        pool.query(sql, bind, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },
    
    getOccupiedUserHives: function(apiaryID, groupID, callback){
        let inGroupID = groupID ? groupID : 0;

        let sql = `SELECT H.ID, H.Number
                FROM hive H
                    JOIN family F
                        ON F.HiveID = H.ID
                        AND F.Active = 1
                WHERE H.ApiaryID = ?
                    AND ((H.GroupID IS NULL AND ? < 1)
                        OR H.GroupID = ?)
                    AND H.Active = 1
                ORDER BY H.Number`

        let bind = [apiaryID, inGroupID, inGroupID];

        pool.query(sql, bind, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    getHiveList: function(userID, callback){
        let sql = `SELECT
                    H.ApiaryName
                    ,H.ApiaryID
                    ,H.GroupName
                    ,H.GroupID
                    ,H.HiveNum
                    ,H.HiveID
                    ,H.FamilyID
                FROM (SELECT 
                        A.Name 		AS ApiaryName
                        ,A.ID       AS ApiaryID
                        ,HG.Name 	AS GroupName
                        ,HG.ID      AS GroupID
                        ,H.Number 	AS HiveNum
                        ,H.ID       AS HiveID
                        ,F.ID 		AS FamilyID
                        ,F.Active 	AS Active
                    FROM user_apiary UA
                        LEFT JOIN apiary A
                            ON A.ID = UA.ApiaryID
                            AND A.Active = 1
                        LEFT JOIN hive_group HG
                            ON HG.ApiaryID = A.ID
                            AND HG.Active = 1
                        LEFT JOIN hive H
                            ON H.ApiaryID = A.ID
                            AND H.GroupID IS NOT NULL 
                            AND H.GroupID = HG.ID
                            AND H.Active = 1
                        LEFT JOIN family F
                            ON F.HiveID = H.ID
                            AND F.Active = 1
                    WHERE UA.UserID = ?
                        AND UA.Active = 1
                    UNION 
                    SELECT 
                        A.Name 		AS ApiaryName
                        ,A.ID       AS ApiaryID
                        ,NULL 		AS GroupName
                        ,NULL       AS GroupID
                        ,H.Number 	AS HiveNum
                        ,H.ID       AS HiveID
                        ,F.ID 		AS FamilyID
                        ,F.Active 	AS Active
                    FROM user_apiary UA
                        JOIN apiary A
                            ON A.ID = UA.ApiaryID
                            AND A.Active = 1
                        JOIN hive H
                            ON H.ApiaryID = A.ID
                            AND H.GroupID IS NULL 
                            AND H.Active = 1
                        LEFT JOIN family F
                            ON F.HiveID = H.ID
                            AND F.Active = 1
                    WHERE UA.UserID = ?
                        AND UA.Active = 1
                ) H
                ORDER BY H.ApiaryName, ISNULL(H.GroupName), 
                    H.GroupName, H.HiveNum`

        pool.query(sql, [userID, userID], function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    getUserFamilyList: function(userID, callback){
        let sql = `SELECT 
                F.ID AS ID
                ,CASE 
                    WHEN HG.ID IS NULL
                        THEN CONCAT(A.ApiaryNo, ' - ', H.Number)
                    ELSE CONCAT(A.ApiaryNo, ' - ', HG.Name, ' - ', H.Number)
                END AS Name
            FROM family F
                JOIN hive H
                    ON H.ID = F.HiveID
                LEFT JOIN hive_group HG
                    ON HG.ID = H.GroupID
                JOIN apiary A
                    ON A.ID = H.ApiaryID
                JOIN user_apiary UA
                    ON UA.ApiaryID = A.ID
            WHERE F.Active = 1
                AND UA.UserID = ?
            ORDER BY A.ApiaryNo, HG.Name, H.Number`

        pool.query(sql, [userID], function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    getFamilyAttributes: async function(attributeType){
        let sql = `SELECT
                    Attribute 
                    ,Description
                FROM attribute
                WHERE AttributeType = ?
                ORDER BY SequenceNo;`

        try {
            let result = await pool.query(sql, attributeType);

            if(result.length)
                return result;
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    getFamilyAttributesForPopup: async function(attrDict, callback){
        try{
            let attrList = [];
            for(let i in attrDict['name[]'])
                attrList.push(this.getFamilyAttributes(attrDict['type[]'][i]));

            let result = await Promise.all(attrList);
            let resultDict = {};
            for(let i in attrDict['name[]'])
                resultDict[attrDict['name[]'][i]] = result[i];

            logger.consoleLog(new Date(), ['getFamilyAttributesForPopup', resultDict]);
            
            if(result.length) {
                callback(resultDict);
            }else
                callback(null);
        } catch (err) {
            callback(err);
        }
    },

    // Find ------------------------------------------------------------------------------
    findActiveApiary: async function(apiary = null, key){
        let sql = `SELECT 
                    ID
                    ,Name 
                FROM apiary 
                WHERE ${key} = ?
                    AND Active = 1`;

        try {
            let result = await pool.query(sql, apiary);

            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    findActiveGroup: async function(apiaryID, groupItem, key){
        let sql = `SELECT ID, Name 
                FROM hive_group 
                WHERE ApiaryID = ? 
                    AND ${key} = ?
                    AND Active = 1`;

        try {
            let result = await pool.query(sql, [apiaryID, groupItem]);

            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },
    
    findActiveHive3: async function(apiaryID, groupID, hiveNum){
        logger.consoleLog(new Date(), [apiaryID, groupID, hiveNum]);
        let sql = `SELECT ID, Number 
                FROM hive
                WHERE ApiaryID = ? 
                    AND Number = ?
                    AND (GroupID = ? OR (? = '' AND GroupID IS NULL))
                    AND Active = 1`;

        try {
            let result = await pool.query(sql, [apiaryID, hiveNum, groupID, groupID]);
            
            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    findActiveHive1: async function(hiveID){
        let sql = `SELECT ID, Number 
                FROM hive
                WHERE ID = ?
                    AND Active = 1`;

        try {
            let result = await pool.query(sql, [hiveID]);
            
            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    // Create ----------------------------------------------------------------------------
    createApiary: async function(name, creationDate, createdBy, userID, callback){
        let apiaryNo = name.replace(/\s/g, '');
        let sqlInsApr = `INSERT INTO apiary(Name, ApiaryNo, StartTime, 
                            CreatedBy, LastUpdatedBy, Active)
                        VALUES(?, ?, ?, ?, ?, 1)`;
        let sqlInsUsrApr = `INSERT INTO user_apiary(UserID, ApiaryID, 
                            CreatedBy, LastUpdatedBy, Active)
                        VALUES(?, ?, ?, ?, 1)`
        let bindApr = [name, apiaryNo, creationDate, createdBy, createdBy];

        try {
            let apiaryFound = await this.findActiveApiary(apiaryNo, 'ApiaryNo');
            
            if(apiaryFound)
                throw 'APIARY_ALREADY_EXISTS';

            let result = await pool.query(sqlInsApr, bindApr);

            var apiaryID = result.insertId;
            let bindUsrApr = [userID, apiaryID, createdBy, createdBy];
            
            result = await pool.query(sqlInsUsrApr, bindUsrApr);

            if(result)
                callback('SUCCESS');
            else
                callback(null);
        } catch (err) {
            callback(err);
        }
    },

    createGroup: async function(apiaryID, groupName, creationDate, createdBy, callback){
        let sql = `INSERT INTO hive_group(Name, ApiaryID, StartTime, 
                    CreatedBy, LastUpdatedBy, Active)
                VALUES(?, ?, ?, ?, ?, 1)`;
        let bind = [groupName, apiaryID, creationDate, createdBy, createdBy];

        try {
            let apiaryFound = this.findActiveApiary(apiaryID, 'ID');
            let groupFound = this.findActiveGroup(apiaryID, groupName, 'Name');

            let result = await Promise.all([apiaryFound, groupFound]);
            
            if(!result[0])
                throw 'APIARY_NOT_FOUND';
            if(result[1])
                throw 'GROUP_ALREADY_EXISTS';

            pool.query(sql, bind, function(err, group){
                if(err) throw err;
    
                if(group) {
                    callback('SUCCESS');
                }else
                    callback(null);
            });
        } catch (err) {
            callback(err);
        }
    },

    createHive: async function(apiaryID, groupID, hiveNum, creationDate, createdBy, 
            callback){
        let sql, bind;
        if(groupID === ''){
            sql = `INSERT INTO hive(Number, ApiaryID, StartTime, 
                    CreatedBy, LastUpdatedBy, Active)
                VALUE(?, ?, ?, ?, ?, 1)`;
            bind = [hiveNum, apiaryID, creationDate, createdBy, createdBy];
        }else{
            sql = `INSERT INTO hive(Number, ApiaryID, GroupID, StartTime, 
                    CreatedBy, LastUpdatedBy, Active)
                VALUE(?, ?, ?, ?, ?, ?, 1)`;
            bind = [hiveNum, apiaryID, groupID, creationDate, createdBy, createdBy];
        }
        
        try{
            let apiaryFound = this.findActiveApiary(apiaryID, 'ID');
            let groupFound = this.findActiveGroup(apiaryID, groupID, 'ID');
            let hiveFound = this.findActiveHive3(apiaryID, groupID, hiveNum);
            
            let result = await Promise.all([apiaryFound, groupFound, hiveFound]);

            if(!result[0])
                throw 'APIARY_NOT_FOUND';
            if(!result[1] && groupID != '')
                throw 'GROUP_NOT_FOUND';
            if(result[2])
                throw 'HIVE_ALREADY_EXISTS';
            
            pool.query(sql, bind, function(err, hive){
                if(err) throw err;
    
                if(hive) {
                    callback('SUCCESS');
                }else
                    callback(null);
            });
        } catch (err) {
            callback(err);
        }
    },

    createFamily: async function(dataDict, createdBy, callback){
        let sqlAddFamily = `INSERT INTO family(HiveID, StartTime, 
                CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, 1)`;
        let sqlAddDetails = `INSERT INTO family_details(FamilyID, Origin, ParentFamilyID, 
                PricePurchese, CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, ?, ?, 1)`;
        let sqlAddInspection = `INSERT INTO INSPECTION(FamilyID, DateTime, State, Size, Comment, 
                CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, ?, ?, ?, 1)`;

        let price = null;
        let parentID = null;
        if(dataDict.origin === 'PURCHASE' && dataDict.price.length > 0)
            price = dataDict.price;
        else if(dataDict.origin != 'PURCHASE' && dataDict.parentID.length > 0)
            parentID = dataDict.parentID;
        
        let comment = null;
        if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
            comment = dataDict.comment;
            
        try{
            let hiveFound = await this.findActiveHive1(dataDict.hiveID);
            if(!hiveFound)
                throw 'HIVE_NOT_FOUND';

            let resultFamily = await pool.query(sqlAddFamily, 
                [dataDict.hiveID, dataDict.creationDate, createdBy, createdBy]);
            let resultDetails = pool.query(sqlAddDetails, 
                [resultFamily.insertId, dataDict.origin, parentID, price, createdBy, createdBy]);
            let resultInspection = pool.query(sqlAddInspection, 
                [resultFamily.insertId, dataDict.creationDate, dataDict.state, 
                    dataDict.size, dataDict.comment, createdBy, createdBy]);
            
            let result = await Promise.all([resultDetails, resultInspection]);

            if(!resultFamily || resultFamily.affectedRows == 0)
                throw 'FAILED_TO_ADD_FAMILY';
            else if(!result[0] || result[0].affectedRows == 0)
                throw 'FAILED_TO_ADD_FAMILY';
            else if(!result[1] || result[1].affectedRows == 0)
                throw 'FAILED_TO_ADD_INSPECTION';

            if(result[0]) {
                callback('SUCCESS');
            }else
                callback(null);
            
        } catch (err) {
            callback(err);
        }
    },

    // Delete ----------------------------------------------------------------------------
    deleteApiary: async function(apiaryID, callback) {
        let sqlDelFamily = `UPDATE family
                            SET Active = 0
                            WHERE HiveID IN (SELECT ID
                                FROM hive
                                WHERE ApiaryID = ?
                                    AND Active = 1)`
        let sqlDelHive = `UPDATE hive
                            SET Active = 0
                            WHERE ApiaryID = ?
                                AND Active = 1`;
        let sqlDelGroup = `UPDATE hive_group
                            SET Active = 0
                            WHERE ApiaryID = ?
                                AND Active = 1`;
        let sqlDelUserApiary = `UPDATE user_apiary
                            SET Active = 0
                            WHERE ApiaryID = ?`;
        let sqlDelApiary = `UPDATE apiary
                            SET Active = 0
                            WHERE ID = ?`;

        try {
            let resultFamily = await pool.query(sqlDelFamily, [apiaryID]);
            let resultHive = await pool.query(sqlDelHive, [apiaryID]);
            let resultGroup = await pool.query(sqlDelGroup, [apiaryID]);
            let resultUserApiary = await pool.query(sqlDelUserApiary, [apiaryID]);
            let resultApiary = await pool.query(sqlDelApiary, [apiaryID]);

            if(resultApiary.affectedRows == 1 && resultHive.affectedRows >= 1){
                callback('SUCCESS_APIARY_HIVE');
            }else if(resultApiary.affectedRows == 1){
                callback('SUCCESS_APIARY');
            }else{
                callback(null);
            }
        } catch (err) {
            callback(err);
        }
    },

    deleteGroup: async function(groupID, callback) {
        let sqlDelFamily = `UPDATE family
                            SET Active = 0
                            WHERE HiveID IN (SELECT ID
                                FROM hive
                                WHERE GroupID = ?
                                    AND Active = 1)`
        let sqlDelHive = `UPDATE hive
                            SET Active = 0
                            WHERE GroupID = ?
                                AND Active = 1`;
        let sqlDelGroup = `UPDATE hive_group
                            SET Active = 0
                            WHERE ID = ?`;

        try {
            let resultFamily = await pool.query(sqlDelFamily, [groupID]);
            let resultHive = await pool.query(sqlDelHive, [groupID]);
            let resultGroup = await pool.query(sqlDelGroup, [groupID]);

            if(resultGroup.affectedRows == 1 && resultHive.affectedRows >= 1 && 
                    resultFamily.affectedRows >= 1){
                callback('SUCCESS_GROUP_HIVE_FAMILY');
            }else if(resultGroup.affectedRows == 1 && resultHive.affectedRows >= 1){
                callback('SUCCESS_GROUP_HIVE');
            }else if(resultGroup.affectedRows == 1){
                callback('SUCCESS_GROUP');
            }else{
                callback(null);
            }
        } catch (err) {
            callback(err);
        }
    },
    
    deleteHive: async function(hiveID, callback) {
        let sqlDelFamily = `UPDATE family
                            SET Active = 0
                            WHERE HiveID = ?
                                AND Active = 1`;
        let sqlDelHive = `UPDATE hive
                            SET Active = 0
                            WHERE ID = ?`;

        try {
            let resultFamily = await pool.query(sqlDelFamily, [hiveID]);
            let resultHive = await pool.query(sqlDelHive, [hiveID]);

            if(resultFamily.affectedRows == 1 && resultHive.affectedRows == 1){
                callback('SUCCESS_HIVE_FAMILY');
            }else if(resultHive.affectedRows == 1){
                callback('SUCCESS_HIVE');
            }else{
                callback(null);
            }
        } catch (err) {
            callback(err);
        }
    },

    deleteFamily: async function(familyID, updatedBy, dataDict, callback) {
        let sqlDelFamily = `UPDATE family
            SET Active = 0, EndTime = ?
            WHERE ID = ?`;
        let sqlUpdateDetails = `INSERT INTO family_details(FamilyID, EndReason, PriceSell, LastUpdatedBy)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE EndReason = ?, PriceSell = ?, LastUpdatedBy = ?`
        let sqlAddInspection = `INSERT INTO INSPECTION(FamilyID, DateTime, State, Size, Comment, 
                CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, ?, ?, ?, 1)`;

        let price = null;
        if(dataDict.price.length >= 0 && dataDict.endReason === 'SALE')
            price = dataDict.price;
		
		let comment = null;
		if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
			comment = dataDict.comment;

        try {
            let resultFamily = pool.query(sqlDelFamily, [dataDict.transactionTime, familyID]);
            let resultDetails = pool.query(sqlUpdateDetails, 
                [familyID, dataDict.endReason, price, updatedBy, dataDict.endReason, price, updatedBy]);
            let resultInspection = pool.query(sqlAddInspection, 
                [familyID, dataDict.transactionTime, dataDict.state, 
                    dataDict.size, dataDict.comment, updatedBy, updatedBy]);

            let result = await Promise.all([resultFamily, resultDetails, resultInspection]);

            if(result[0].affectedRows == 1){
                callback('SUCCESS_FAMILY');
            }else{
                callback(null);
            }
        } catch (err) {
            callback(err);
        }
    }
}

module.exports = Apiary;
