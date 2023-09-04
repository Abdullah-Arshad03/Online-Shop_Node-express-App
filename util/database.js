const Sequelize = require('sequelize')


const sequelize = new Sequelize( 'online_nodejs_shop' , 'root' , 'imabdullah' , {dialect : 'mysql' , host : 'localhost'})

module.exports = sequelize





















// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host : 'localhost' ,
//     user : 'root',
//     database : 'online_nodejs_shop',
//     password : 'imabdullah'

// });

// module.exports = pool.promise();


