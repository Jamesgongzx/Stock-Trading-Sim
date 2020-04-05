const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    var subscriptionType = req.session.subscriptionType;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.status(401).send("Player not authorized!");
        return;
    }

    var serverDayOfWeek = null;
    let weekArray = [null, 7, 1, 2, 3, 4, 5, 6]
    var response = { code: null, message: null };
    database.query('SELECT DAYOFWEEK(now()) as day', [])
        .then(
            results => {
                if (results.length > 0) {
                    serverDayOfWeek = results[0]['day'];
                    serverDayOfWeek = weekArray[serverDayOfWeek];
                    if (subscriptionType == "None") {
                        return database.query("SELECT * FROM shop WHERE dayOfWeek = ? AND category NOT LIKE '%Premium%'", [serverDayOfWeek]);
                    } else {
                        return database.query("SELECT * FROM shop WHERE dayOfWeek = ?", [serverDayOfWeek]);
                    }
                }
            }
        ).then(
            results => {
                res.status(200).send(results);
            }
        ).catch(
            error => {
                if (!response.code) {
                    response.code = 500;
                    response.message = "Internal Server Error";
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

router.get("/categories", (req, res) => {
    database.query("SELECT distinct category from shop order by category", [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/:dayOfWeek/:category", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;

    database.query('SELECT * FROM shop WHERE dayOfWeek = ? AND category = ?', [dayOfWeek, category])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/:dayOfWeek/:category/items", async (req, res) => {
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;
    let query = "SELECT i.itemName, cost, amount, description " +
        "FROM item i NATURAL JOIN shop s NATURAL JOIN shopItemR sir " +
        "WHERE s.dayOfWeek = ? AND s.category = ?";
    database.query(query, [dayOfWeek, category])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error);
                res.status(500).send("Internal Server Error!");
            }
        )
});

// Requires amount field in req.body
router.post("/:dayOfWeek/:category/items/:name/purchase", (req, res) => {
    var itemName = req.params.name;
    itemName = decodeURIComponent(itemName);
    var dayOfWeek = req.params.dayOfWeek;
    var category = req.params.category;
    console.log(req.params);
    console.log(req.body);

    var amount = req.body.amount;
    var playerId = req.session.playerId;
    var subscriptionType = req.session.subscriptionType;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.status(401).send("Player not authorized!");
        return;
    }

    var amountNumber = Number(amount);
    if (amountNumber == 0 || !Number.isInteger(amountNumber) || amountNumber < 0){
        res.status(400).send("Please enter a positive integer!");
        return;
    }
    if (isNaN(amountNumber)) {
        res.status(400).send("Please enter a number!");
        return;
    }

    if (subscriptionType) {
        if (category.includes("Premium") && subscriptionType != "Premium") {
            res.status(403).send("This shop is for premium only!");
            return;
        }
    }

    var itemCost = null;
    var amountAvailable = null;
    var serverDayOfWeek = null
    var money = null;
    var moneyToSpend = null;
    var response = { code: null, message: null };
    let weekArray = [null, 7, 1, 2, 3, 4, 5, 6]
    database.query("SELECT DAYOFWEEK(NOW()) as day", [])
        .then(
            results => {
                serverDayOfWeek = results[0]['day'];
                serverDayOfWeek = weekArray[serverDayOfWeek];
                console.log(serverDayOfWeek);
                if (serverDayOfWeek != dayOfWeek) {
                    response.code = 403;
                    response.message = "Shop not available today!";
                    throw new Error("Shop not available today!");
                }
                return database.query('SELECT cost, amount ' +
                    'FROM item i NATURAL JOIN shop s NATURAL JOIN shopItemR sir ' +
                    'WHERE s.dayOfWeek = ? AND s.category = ? and i.itemname = ?', [dayOfWeek, category, itemName]);
            }
        ).then(
            results => {
                if (results.length > 0) {
                    itemCost = results[0].cost;
                    amountAvailable = results[0].amount;
                    if (amount > amountAvailable) {
                        response.code = 403;
                        response.message = "Amount requested is greater than amount available!";
                        throw new Error("Amount requested is greater than amount available!");
                    }
                    return database.query('SELECT money FROM playerOwnership where playerId = ?', [playerId]);
                } else {
                    response.code = 400;
                    response.message = "Item not found in shop!";
                    throw new Error("Item not found in shop!");
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    money = results[0].money;
                    moneyToSpend = itemCost * amount;
                    var canPurchase = money >= moneyToSpend;
                    if (!canPurchase) {
                        response.code = 403;
                        response.message = "Not enough money to purchase item!";
                        throw new Error("Not enough money to purchase item!");
                    }
                    return database.query('SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, itemName]);
                } else {
                    response.code = 400;
                    response.message = "Player not found!";
                    throw new Error("Player not found!");
                }
            }
        ).then(
            results => {
                // Update playerItemR item amount or insert item
                if (results.length > 0) {
                    return database.query('UPDATE playerItemR SET amount = amount + ? WHERE playerId = ? AND itemName = ?', [amount, playerId, itemName]);
                } else {
                    return database.query('INSERT INTO playerItemR VALUES (?, ?, ?, false)', [playerId, itemName, amount]);
                }
            }
        ).then(
            results => {
                // Update shopItemR item amount
                return database.query('UPDATE shopItemR SET amount = amount - ? WHERE dayOfWeek = ? AND category = ? AND itemName = ?', [amount, dayOfWeek, category, itemName]);
            }
        ).then(
            results => {
                // Update player money
                return database.query('UPDATE PlayerOwnership SET money = money - ? WHERE playerId = ?', [moneyToSpend, playerId]);
            }
        ).then(
            results => {
                // Insert transition record
                return database.query('INSERT INTO transitionRecordOwnership VALUES (DEFAULT, ?, ?, ?, ?)', [itemName, -moneyToSpend, amount, playerId]);
            }
        ).then(
            results => {
                res.sendStatus(200);
            }
        ).catch(
            error => {
                if (!response.code) {
                    response.code = 500;
                    response.message = "Internal Server Error";
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