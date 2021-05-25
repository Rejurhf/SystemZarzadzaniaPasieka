const pool = require('./pool');

function Apiary(){};

Apiary.prototype = {
    // Get all Apiaries TODO: Get all Apiaries available for user
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

    findUserApiaries: function(userID, callback){
        let sql = `SELECT A.ID, A.Name
                    FROM user_apiary UA
                        JOIN apiary A
                            ON A.ID = UA.ApiaryID
                            AND A.Active = 1
                    WHERE UA.UserID = ?`

        pool.query(sql, userID, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    findUserHiveGroups: function(apiaryID, callback){
        let sql = `SELECT HG.ID, HG.Name
                    FROM hive_group HG
                    WHERE HG.ApiaryID = ?
                        AND HG.Active = 1`;

        pool.query(sql, apiaryID, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    findUserHives: function(apiaryID, groupID, callback){
        let sql = `SELECT H.ID, H.Number
                    FROM hive H
                    WHERE H.ApiaryID = ?
                        AND ((H.GroupID IS NULL AND ? < 1)
                            OR H.GroupID = ?)
                        AND H.Active = 1`

        let bind = [apiaryID, groupID, groupID];

        pool.query(sql, bind, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result);
            }else
                callback(null);
        })
    },

    findGroup: async function(apiaryID, groupItem, key){
        let sql = `SELECT ID, Name FROM hive_group WHERE ApiaryID = ? AND ${key} = ?`;

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
        let sql = `SELECT ID, Number FROM hive
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
    }
}

module.exports = Apiary;
