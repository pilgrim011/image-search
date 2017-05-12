var mysql = require("mysql");
 var connection = mysql.createPool({
 connectionLimit : 10,
 host: "localhost",
 user: "example",
 password: "example",
 database: "imagesearch",
 multipleStatements: true
 });

module.exports = connection;
