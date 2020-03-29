const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.get("/:dayOfWeek/:category", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;

    connection.query('SELECT * FROM shop WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/:dayOfWeek/:category/items", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;

    connection.query('SELECT itemName, cost, amount, description FROM item, shop, shopItemR WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

module.exports = router;