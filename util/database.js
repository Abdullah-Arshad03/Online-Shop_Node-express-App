
const mysql = require('mysql2')

const pool = mysql.createPool({
    host : 'localhost' ,
    user : 'root',
    database : 'online_nodejs_shop',
    password : 'imabdullah'

});

module.exports = pool.promise();


