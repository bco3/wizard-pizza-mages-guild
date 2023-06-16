require("dotenv").config();

const mysql = require("mysql");

const urlDB = `mysql://root:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

const connection = mysql.createConnection(urlDB);

module.exports = connection;
