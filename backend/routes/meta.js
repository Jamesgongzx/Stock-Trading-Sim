const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/tables", async (req, res) => {
    let adminId = req.session.adminId;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query("SELECT table_name FROM INFORMATION_SCHEMA.TABLES where table_schema = 'stocktradingsim' order by table_name", [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/tables/:tableName", (req, res) => {
    let tableName = req.params.tableName;
    let adminId = req.session.adminId;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query(`SELECT * from ${tableName}`, [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error)
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/tables/:tableName/columns", (req, res) => {
    let tableName = req.params.tableName;
    let adminId = req.session.adminId;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query(`select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME= ? `, [tableName])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error)
                res.status(500).send("Internal Server Error!");
            }
        )
});

module.exports = router;