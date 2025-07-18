const mysql = require('mysql2');
const db = mysql.createConnection({
   host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});
module.exports = db;


//const mysql = require('mysql2');
//const db = mysql.createConnection({
  //host: 'localhost',
  //user: 'root',
  //password: 'system',  // Add your password
//  database: 'matrimony'
//});
//db.connect((err) => {
  //if (err) throw err;
  //console.log('MySQL Connected');
//});
//module.exports = db;
