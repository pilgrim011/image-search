var mysql = require("mysql");
 var connection = mysql.createPool({
 connectionLimit : 10,
 host: "example",
 user: "example",
 password: "example",
 database: "example",
 multipleStatements: true
 });

module.exports = connection;
