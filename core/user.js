
const pool = require('./pool');
const bcrypt = require('bcrypt');

function User(){};

User.prototype = {
    // Find user data by ID or UserName
    find: function(user = null, callback){
        // If user = number return field = id, if user = staring return field = username
        if(user){
            var field = Number.isInteger(user) ? 'ID' : 'UserNo';
        }

        // TODO Error here
        // "You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near ' `affectedRows` = 1, `insertId` = 2, `serverStatus` = 2, `warningCount` = 0, ...' at line 1",
        // "SELECT * FROM user WHERE UserNo = `fieldCount` = 0, `affectedRows` = 1, `insertId` = 2, `serverStatus` = 2, `warningCount` = 0, `message` = '', `protocol41` = true, `changedRows` = 0"
        // lastID

        let sql = `SELECT * FROM user WHERE ${field} = ?`;

        pool.query(sql, user, function(err, result) {
            if(err) throw err;

            if(result.length) {
                callback(result[0]);
            }else
                callback(null);
        });
    },

    create: function(body, callback){
        let pwd = body.password;
        body.password = bcrypt.hashSync(pwd,10);

        var bind = [];

        for(prop in body){
            bind.push(body[prop]);
        }

        let sql = 'INSERT INTO user(FirstName, LastName, UserNo, Password, Active, CreatedBy, LastUpdatedBy) VALUES (?,?,?,?,?,?,?)';

        pool.query(sql, bind, function(err, lastID){
            if(err) throw err;
            
            callback(lastID);
        });
    },

    login : function(userNo, password, callback){
        // find the user data by his username.
        this.find(userNo, function(user) {
            // if there is a user by this username.
            if(user) {
                // now we check his password.
                if(bcrypt.compareSync(password, user.Password)) {
                    // return his data.
                    callback(user);
                    return;
                }  
            }
            // if the username/password is wrong then return null.
            callback(null);
        });
    }
}

module.exports = User;



