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

    createApiary: function(name, creationDate, createdBy, callback){
        let apiaryNo = name.replace(/\s/g, '');

        this.findApiary(apiaryNo, 'ApiaryNo', function(apiary){
            if(apiary){
               callback('Apiary already exists'); 
            }else{
                let sql = `INSERT INTO apiary(Name, ApiaryNo, StartTime, 
                        CreatedBy, LastUpdatedBy, Active)
                    VALUES(?, ?, ?, ?, ?, 1)`;
                
                let bind = [name, apiaryNo, creationDate, createdBy, createdBy];
                
                pool.query(sql, bind, function(err, lastID) {
                    if(err) throw err;
         
                    callback(lastID);
                });
            }
        });
    }
}

module.exports = Apiary;
