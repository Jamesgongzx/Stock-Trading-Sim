const mysql = require("mysql");

//set up for mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  // database: "stocktradingsim",
  multipleStatements: true
});

module.exports = connection;
