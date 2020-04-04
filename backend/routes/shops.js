const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    var subscriptionType = req.session.subscriptionType;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    var serverDayOfWeek = null;
    var response = { code: null, message: null };
    database.query('SELECT DAYOFWEEK(now())', [])
        .then(
            results => {
                if (results.length > 0) {
                    serverDayOfWeek = results[0]['DAYOFWEEK(now())'];
                    if (subscriptionType == "None") {
                        return database.query("SELECT cost, amount FROM item, shop, shopItemR WHERE dayOfWeek = ? AND category NOT LIKE '%Premium%'", [serverDayOfWeek]);
                    } else {
                        return database.query("SELECT cost, amount FROM item, shop, shopItemR WHERE dayOfWeek = ?", [serverDayOfWeek]);
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
                res.sendStatus(500);
            }
        )
});

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
    let query = "SELECT i.itemName, cost, amount, description " +
        "FROM item i, shop s, shopItemR sir " +
        "WHERE s.dayOfWeek = ? AND s.category = ?  " +
        "and i.itemname = sir.itemname and sir.dayofweek = s.dayofweek and sir.category = s.category";
    database.query(query, [dayOfWeek, category])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendStatus(204);
                }
            },
            error => {
                console.log(error);
                res.sendStatus(500);
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
    var serverDayOfWeek = null
    var money = null;
    var moneyToSpend = null;
    var response = { code: null, message: null };
    let weekArray = [null,7,1,2,3,4,5,6]
    database.query("SELECT DAYOFWEEK(NOW()) as day", [])
        .then(
            results => {
                if (results.length > 0) {
                    serverDayOfWeek = results[0]['day'];
                    serverDayOfWeek = weekArray[serverDayOfWeek];
                    console.log(serverDayOfWeek);
                    if (serverDayOfWeek != dayOfWeek) {
                        response.code = 403;
                        response.message = "Shop not available today";
                        throw new Error("Shop not available today");
                    }
                    return database.query('SELECT cost, amount ' +
                        'FROM item i, shop s, shopItemR sir ' +
                        'WHERE s.dayOfWeek = ? AND s.category = ? and i.itemname = ?' +
                        'and i.itemname = sir.itemname and sir.dayofweek = s.dayofweek and sir.category = s.category', [dayOfWeek, category, itemName]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    console.log(results);
                    itemCost = results[0].cost;
                    amountAvailable = results[0].amount;
                    if (amount > amountAvailable) {
                        response.code = 403;
                        response.message = "Amount requested is greater than amount available";
                        throw new Error("Amount requested is greater than amount available");
                    }
                    return database.query('SELECT money FROM playerOwnership where playerId = ?', [playerId]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    console.log(results);
                    money = results[0].money;
                    moneyToSpend = itemCost * amount;
                    console.log(money);
                    console.log(moneyToSpend);
                    var canPurchase = money >= moneyToSpend;
                    if (!canPurchase) {
                        response.code = 403;
                        throw new Error();
                    }
                    return database.query('SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, itemName]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                // Update item amount or insert item
                if (results.length > 0) {
                    return database.query('UPDATE playerItemR SET amount = amount + ? WHERE playerId = ? AND itemName = ?', [amount, playerId, itemName]);
                } else {
                    return database.query('INSERT INTO playerItemR VALUES (?, ?, ?, false)', [playerId, itemName, amount]);
                }
            }
        ).then(
            results => {
                // Update player money
                return database.query('UPDATE PlayerOwnership SET money = money - ? WHERE playerId = ?', [moneyToSpend, playerId]);
                // res.sendStatus(200);
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