const pool = require('./pool');

function Apiary(){};

Apiary.prototype = {
    // Get all Apiaries TODO: Get all Apiaries available for user
    getApiaries: function(user = null, callback){
        let sql = `SELECT ID, Name FROM apiary WHERE Active = 1`;

        pool.query(sql, user, function(err, result) {
            if(err) 
                throw err;

            if(result.length) {
                callback(result);
            }else{
                callback(null);
            }
        });
    }
}
