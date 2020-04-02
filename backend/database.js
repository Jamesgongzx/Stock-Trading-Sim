const mysql = require("mysql");

class database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            // database: "stocktradingsim",
            multipleStatements: true
        });
    }
    query(query, paramsArray) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, paramsArray, function (error, results) {
                if (error) reject(error);
                resolve(results);
            });
        })
    }
}
module.exports = new database();