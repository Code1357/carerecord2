'use strict';

/** mysqlをモジュール化 */
const mysql = require('mysql2');

/** mysql接続情報 */ // 課題：情報を隠す
/* const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7',
  database: 'care_record'
}); */

const connection = mysql.createConnection({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'b0e681e5863f2a',
  password: '04233a2e',
  database: 'heroku_6cf0992d51a3999'
});

module.exports = connection;
