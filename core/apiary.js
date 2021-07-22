const pool = require('./pool');

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
                        AND F.Active
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

    // Find ------------------------------------------------------------------------------
    findApiary: async function(apiary = null, key){
        let sql = `SELECT ID, Name FROM apiary WHERE ${key} = ?`;

        try {
            let result = await pool.query(sql, apiary);

            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    findGroup: async function(apiaryID, groupItem, key){
        let sql = `SELECT ID, Name 
                FROM hive_group 
                WHERE ApiaryID = ? AND ${key} = ?`;

        try {
            let result = await pool.query(sql, [apiaryID, groupItem]);

            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },
    
    findHive: async function(apiaryID, groupID, hiveNum){
        let sql = `SELECT ID, Number 
                FROM hive
                WHERE ApiaryID = ? AND Number = ?
                    AND (GroupID = ? OR (? = '' AND GroupID IS NULL))`;

        try {
            let result = await pool.query(sql, [apiaryID, hiveNum, groupID, groupID]);
            
            if(result.length)
                return result[0];
        } catch (err){
            throw new Error(err);
        }

        return;
    },

    findHive: async function(hiveID){
        let sql = `SELECT ID, Number 
                FROM hive
                WHERE ID = ?`;

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
            let apiaryFound = await this.findApiary(apiaryNo, 'ApiaryNo');
            
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
            let apiaryFound = this.findApiary(apiaryID, 'ID');
            let groupFound = this.findGroup(apiaryID, groupName, 'Name');

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
            let apiaryFound = this.findApiary(apiaryID, 'ID');
            let groupFound = this.findGroup(apiaryID, groupID, 'ID');
            let hiveFound = this.findHive(apiaryID, groupID, hiveNum);
            
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

    createFamily: async function(hiveID, creationDate, createdBy, callback){
        let sql = `INSERT INTO family(HiveID, StartTime, CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, 1)`;
        let bind = [hiveID, creationDate, createdBy, createdBy];
        
        try{
            let hiveFound = await this.findHive(hiveID);

            if(!hiveFound)
                throw 'HIVE_NOT_FOUND';
            
            pool.query(sql, bind, function(err, family){
                if(err) throw err;

                if(family) {
                    callback('SUCCESS');
                }else
                    callback(null);
            });
        } catch (err) {
            callback(err);
        }
    },

    // Delete ----------------------------------------------------------------------------
    deleteHive: async function(hiveID, callback) {
        let sqlDelFamily = `DELETE FROM family
                            WHERE HiveID = ?`;
        let sqlDelHive = `DELETE FROM hive
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
    }
}

module.exports = Apiary;
