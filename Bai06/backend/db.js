const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'mysql-16b7e0ab-anhanh190205-8701.g.aivencloud.com',
  port: '25093',
  user: 'avnadmin',
  password:  process.env.DB_PASS,
  database: 'auth_app'
});

db.connect(err => {
  if (err) {
    console.log('DB error:', err);
  } else {
    console.log('MySQL connected');
  }
});

module.exports = db;
