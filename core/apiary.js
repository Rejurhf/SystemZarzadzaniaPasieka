const pool = require('./pool');

function Apiary(){};

Apiary.prototype = {
    // Get all Apiaries TODO: Get all Apiaries available for user
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

    findApiary: function(apiary = null, key, callback){
        let sql = `SELECT Name FROM apiary WHERE ${key} = ?`;

        pool.query(sql, apiary, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result[0]);
            }else
                callback(null);
        });
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
                        AND HG.Active = 1`

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

    createApiary: function(name, creationDate, createdBy, userID, callback){
        let apiaryNo = name.replace(/\s/g, '');

        this.findApiary(apiaryNo, 'ApiaryNo', async function(apiary){
            if(apiary){
                callback('Apiary already exists'); 
            }else{
                let sqlInsApr = `INSERT INTO apiary(Name, ApiaryNo, StartTime, 
                        CreatedBy, LastUpdatedBy, Active)
                    VALUES(?, ?, ?, ?, ?, 1)`;
                let sqlInsUsrApr = `INSERT INTO user_apiary(UserID, ApiaryID, 
                        CreatedBy, LastUpdatedBy, Active)
                    VALUES(?, ?, ?, ?, 1)`
                
                let bindApr = [name, apiaryNo, creationDate, createdBy, createdBy];
                
                try {
                    let result = await pool.query(sqlInsApr, bindApr);

                    var apiaryID = result.insertId;
                    let bindUsrApr = [userID, apiaryID, createdBy, createdBy];
                    
                    result = await pool.query(sqlInsUsrApr, bindUsrApr);
                }catch(err){
                    throw new Error(err);
                }
                
                callback(apiaryID);
            }
        });
    }
}

module.exports = Apiary;
