const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", async (req, res) => {
    // Schema = Stock (name, currentPrice, 24hChange)
    // Example:
    // var selections = ["name", "currentPrice"];
    // var conditions = [{
    //     fieldName: "currentPrice",
    //     isGreater: true,
    //     value: 100
    // }, {
    //     fieldName: "24hChange",
    //     isGreater: true,
    //     value: 100
    // }];

    var selections = req.body.selections;
    var conditions = req.body.conditions;

    var selectionString = "";
    if (selections) {
        selectionString = selections.join();
    } else {
        selectionString = "*";
    }

    var whereStatement = "";
    if (conditions) {
        whereStatement.concat(" WHERE ");
        if (conditions.length > 3) {
            res.sendStatus(500);
            return;
        }
        for (var i = 0; i < conditions.length; i++) {
            var condition = conditions[i];
            if (["name", "currentPrice", "24hChange"].indexOf(condition.fieldName) < 0) {
                res.sendStatus(500);
                return;
            }
            if (typeof condition.isGreater !== "boolean") {
                res.sendStatus(500);
                return;
            }
            if (isNaN(condition.value)) {
                res.sendStatus(500);
                return;
            }
            var conditionString = "";
            conditionString.concat(" " + condition.fieldName);
            if (condition.isGreater == true) {
                conditionString.concat(">" + condition.value);
            } else {
                conditionString.concat("<" + condition.value);
            }
            if (whereStatement.length > 6) {
                whereStatement.concat("," + conditionString);
            }
        }
    }

    database.query('SELECT ' + selectionString + ' FROM stock' + whereStatement, [])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(200);
                }
            }
        )
});

router.get("/:name", (req, res) => {
    var name = req.params.name;
    database.query('SELECT * FROM stock where name = ?', [name])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
            }
        )
});

// delete route
router.post("/:name", (req, res) => {
    var name = req.params.name;
    database.query('DELETE FROM stock where name = ?', [name])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/:name/company", (req, res) => {
    var stockName = req.params.name;
    database.query('SELECT * FROM company where stockName = ?', [stockName])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/:name/records", (req, res) => {
    var name = req.params.name;
    database.query('SELECT * FROM stockRecordOwnership where name = ?', [name])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
            }
        )
});

// TODO: Add transitionRecord

// Requires amount field in req.body
router.post("/:name/purchase", (req, res) => {
    var name = req.params.name;
    var amount = req.body.amount;

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;
    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    var currentPrice = null;
    var money = null;
    var response = { code: null, message: null };
    database.query('SELECT currentPrice FROM stock where name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    currentPrice = results[0].currentPrice;
                    return database.query('SELECT money FROM playerOwnership where playerId = ?', [playerId]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    money = results[0].money;
                    var canPurchase = money >= (currentPrice * amount);
                    console.log(money)
                    console.log(currentPrice);
                    if (!canPurchase) {
                        response.code = 403;
                        response.message = "Not enough money to purchase"
                        throw new Error("Not enough money to purchase");
                    }
                    return database.query('SELECT * FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                // already Owned
                if (results.length > 0) {
                    return database.query('UPDATE playerStockR SET amount = amount + ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name]);
                } else {
                    return database.query('INSERT INTO playerStockR VALUES (?, ?, ?)', [playerId, name, amount]);
                }
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

// Requires amount field in req.body
router.post("/:name/sell", (req, res) => {
    var name = req.params.name;
    var amount = req.body.amount;

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;
    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    var currentPrice = null;
    var amountOwned = null;
    var response = { code: null, message: null };
    database.query('SELECT currentPrice FROM stock where name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    currentPrice = results[0].currentPrice;
                    return database.query('SELECT amount FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    amountOwned = results[0].amount;
                    var canSell = amountOwned >= amount;
                    if (!canSell) {
                        response.code = 403;
                        response.message = "Not enough amount owned to sell"
                        throw new Error("Not enough amount owned to sell");
                    }
                    var amountAfterSell = amountOwned - amount;
                    if (amountAfterSell == 0) {
                        return database.query('DELETE FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                    } else {
                        return database.query('UPDATE playerStockR SET amount = amount - ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name]);
                    }
                } else {
                    response.code = 400;
                    throw new Error();
                }
            }
        ).then(
            results => {
                var moneyEarned = currentPrice * amount;
                return database.query('UPDATE playerOwnership SET money = money + ? WHERE playerId = ?', [moneyEarned, playerId]);
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