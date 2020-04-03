const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/:dayOfWeek/:category", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;

    database.query('SELECT * FROM shop WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendStatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/:dayOfWeek/:category/items", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;

    database.query('SELECT itemName, cost, amount, description FROM item, shop, shopItemR WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendStatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

// TODO: Add transitionRecord

// Requires amount field in req.body
router.post("/:dayOfWeek/:category/items/:name/purchase", (req, res) => {
    var amount = req.body.amount;
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;
    var name = req.params.name;
    var playerId = req.session.playerId;
    var subscriptionType = req.session.subscriptionType;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    if (subscriptionType) {
        if (category.includes("Premium") && subscriptionType != "Premium") {
            res.sendStatus(403);
            return;
        }
    }

    var itemCost = null;
    var amountAvailable = null;

    if (amount > amountAvailable) {
        res.sendStatus(403);
        return;
    }

    var serverDayOfWeek = null
    var money = null;
    var moneyToSpend = null;
    var response = { code: null, message: null };
    database.query('SELECT DAYOFWEEK(utc_time())', [])
        .then(
            results => {
                if (results.length > 0) {
                    serverDayOfWeek = results[0]['DAYOFWEEK(utc_time())'];
                    if (serverDayOfWeek != dayOfWeek) {
                        response.code = 403;
                        response.message = "Shop not available today";
                        throw new Error("Shop not available today");
                    }
                    database.query('SELECT cost, amount FROM item, shop, shopItemR WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    itemCost = results[0].cost;
                    amountAvailable = results[0].amount;
                    database.query('SELECT money FROM playerOwnership where playerId = ?', [playerId]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    money = results[0].money;
                    moneyToSpend = itemCost * amount;
                    var canPurchase = moneyToSpend >= money;
                    if (!canPurchase) {
                        response.code = 403;
                        throw new Error();
                    }
                    database.query('SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, name]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
            // Update item amount or insert item
            if (results.length > 0) {
                    database.query('UPDATE playerItemR SET amount = amount + ? WHERE playerId = ? AND itemName = ?', [amount, playerId, name]);
                } else {
                    database.query('INSERT INTO playerItemR VALUES (?, ?, ?)', [playerId, name, amount]);
                }
            }
        ).then(
            results => {
                // Update player money
                return database.query('UPDATE PlayerOwnership SET money = money - ? WHERE playerId = ?', [moneyToSpend, playerId]);
                res.sendStatus(200);
            }
        ).then(
            results => {
                res.sendStatus(200);
            }
        ).catch(
            error => {
                if (!response.code) {
                    response.code = 500;
                }
                console.log(error);
                if (response.message) {
                    return res.status(response.code).send(response.message);
                } else {
                    return res.status(response.code);
                }
            }
        )
});

module.exports = router;