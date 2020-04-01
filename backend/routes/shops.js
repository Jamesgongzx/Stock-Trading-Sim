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

    var serverDayOfWeek = null
    connection.query('SELECT DAYOFWEEK(utc_time())', (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            serverDayOfWeek = results[0]['DAYOFWEEK(utc_time())'];
            if (serverDayOfWeek != dayOfWeek) {
                res.sendStatus(403);
                return;
            }
        }
    });

    var itemCost = null;
    var amountAvailable = null;

    if (amount > amountAvailable) {
        res.sendStatus(403);
        return;
    }

    connection.query('SELECT cost, amount FROM item, shop, shopItemR WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            itemCost = results[0].cost;
            amountAvailable = results[0].amount;
        }
    });

    var money = null;
    connection.query('SELECT money FROM playerOwnership where playerId = ?', [playerId], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            money = results[0].money;
        } else {
            res.sendStatus(400);
            return;
        }
    });

    var canPurchase = (itemCost * amount) >= money;

    if (!canPurchase) {
        res.sendStatus(403);
        return;
    }

    // Check if player already owns item
    var alreadyOwned = null;
    connection.query('SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, name], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            alreadyOwned = true;
        }
    });

    if (alreadyOwned) {
        connection.query('UPDATE playerItemR SET amount = amount + ? WHERE playerId = ? AND itemName = ?', [amount, playerId, name], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        connection.query('INSERT INTO playerItemR VALUES (?, ?, ?)', [playerId, name, amount], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            } else {
                res.sendStatus(200);
            }
        });
    }
});

module.exports = router;