const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
	user: 'b41c204bddea98',
    database: 'heroku_14016bef64c0642',
    password: '24126f1b',
   
});

module.exports = pool.promise();