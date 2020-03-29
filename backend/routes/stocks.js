const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.get("/", async (req, res) => {
    connection.query('SELECT * FROM stock', (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/:name", (req, res) => {
    var name = req.params.name;
    connection.query('SELECT * FROM stock where name = ?', [name], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(results);
        }
    });
});

router.get("/:name/company", (req, res) => {
    var stockName = req.params.name;
    connection.query('SELECT * FROM company where stockName = ?', [stockName], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(results);
        }
    });
});

router.get("/:name/records", (req, res) => {
    var name = req.params.name;
    connection.query('SELECT * FROM stockRecordOwnership where name = ?', [name], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(results);
        }
    });
});

module.exports = router;