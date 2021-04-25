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

    findApiary: function(apiary = null, callback){
        let sql = `SELECT Name FROM apiary WHERE Name = ?`;

        pool.query(sql, apiary, function(err, result){
            if(err) throw err;

            if(result.length) {
                callback(result[0]);
            }else
                callback(null);
        });
    }
}

module.exports = Apiary;
