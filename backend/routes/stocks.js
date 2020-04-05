const express = require("express");
const database = require("../database");

var { countDecimals, noExponents } = require("./utils");

const router = express.Router();

router.get("/", async (req, res) => {
    // Schema = Stock (name, currentPrice, 24hChange)
    // Example:
    // var projections = ["name", "currentPrice"];
    // var nameCondition = "AMZN"
    // var numericalConditions = [{
    //     fieldName: "currentPrice",
    //     isGreater: true,
    //     value: 100
    // }, {
    //     fieldName: "24hChange",
    //     isGreater: true,
    //     value: 100
    // }];

    var projections = req.query.projections;
    // console.log(req);
    var nameCondition = req.body.nameCondition;
    var numericalConditions = req.body.numericalConditions;

    var projectionString = "";
    if (projections) {
        projectionString = projections.join();
    } else {
        projectionString = "*";
    }

    var whereStatement = "";
    if (numericalConditions) {
        whereStatement.concat(" WHERE ");
        if (numericalConditions.length > 2) {
            res.status(400).send("Bad request!");
            return;
        }
        for (var i = 0; i < numericalConditions.length; i++) {
            var condition = numericalConditions[i];
            if (["currentPrice", "24hChange"].indexOf(condition.fieldName) < 0) {
                res.status(400).send("Bad request!");
                return;
            }
            if (typeof condition.isGreater !== "boolean") {
                res.status(400).send("Bad request!");
                return;
            }
            if (isNaN(condition.value)) {
                res.status(400).send("Bad request!");
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
    if (nameCondition) {
        if (nameCondition.indexOf(' ') >= 0) {
            res.status(400).send("Bad request!");
            return;
        }
        if (whereStatement.length > 0) {
            whereStatement.concat(", name=" + nameCondition);
        }
    }

    database.query('SELECT ' + projectionString + ' FROM stock' + whereStatement, [])
        .then(
            results => {
                res.status(200).send(results);
            }
        )
});

router.get("/:name", (req, res) => {
    var name = req.params.name;
    database.query('SELECT * FROM stock where name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(400).send("Stock not found!");
                }
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

// delete stock (admin only)
router.delete("/:name", (req, res) => {
    var name = req.params.name;
    var adminId = req.session.adminId;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query('DELETE FROM stock WHERE name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send("Stock deleted!");
                } else {
                    res.status(400).send("Stock not found!");
                }
            },
            error => {
                res.status(500).send("Internal Server Error!");
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
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/:name/records", (req, res) => {
    var name = req.params.name;
    database.query("SELECT * FROM stockRecordOwnership WHERE name = ?  and dateTime <= now() order by datetime asc", [name])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

// Requires amount field in req.body
router.post("/:name/purchase", (req, res) => {
    var name = req.params.name;
    var amount = req.body.amount;

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;
    if (!loggedin) {
        res.status(401).send("Player not authorized!");
        return;
    }

    var amountNumber = Number(amount);
    if (amountNumber == 0 || amountNumber < 0){
        res.status(400).send("Please enter a positive number!");
        return;
    }
    if (isNaN(amountNumber)) {
        res.status(400).send("Please enter a number!");
        return;
    }
    var numDecimals = countDecimals(Number(noExponents(amount)));
    if (numDecimals > 5) {
        res.status(400).send("Please enter a number with less than 5 decimal places!");
        return;
    }

    var money = null;
    var moneyToSpend = null;
    var response = { code: null, message: null };
    // Get currentPrice of stock
    database.query('SELECT currentPrice FROM stock where name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    var currentPrice = results[0].currentPrice;
                    moneyToSpend = currentPrice * amount;
                    console.log(moneyToSpend);
                    // Get money of player
                    return database.query('SELECT money FROM playerOwnership where playerId = ?', [playerId]);
                } else {
                    response.code = 400;
                    response.message = "Stock not found!";
                    throw new Error("Stock not found!");
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    money = results[0].money;
                    var canPurchase = money >= moneyToSpend;
                    console.log(money);
                    if (!canPurchase) {
                        response.code = 403;
                        response.message = "Not enough money to purchase!"
                        throw new Error("Not enough money to purchase!");
                    }
                    // Check if stock is already owned by player
                    return database.query('SELECT * FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                } else {
                    response.code = 400;
                    response.message = "Player not found";
                    throw new Error("Player not found");
                }
            }
        ).then(
            // Update stock amount or insert stock
            results => {
                if (results.length > 0) {
                    return database.query('UPDATE playerStockR SET amount = amount + ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name]);
                } else {
                    return database.query('INSERT INTO playerStockR VALUES (?, ?, ?)', [playerId, name, amount]);
                }
            }
        ).then(
            results => {
                // Update player money
                return database.query('UPDATE PlayerOwnership SET money = money - ? WHERE playerId = ?', [moneyToSpend, playerId]);
            }
        ).then(
            results => {
                var productName = "Stock " + name;
                // Insert transition record
                return database.query('INSERT INTO transitionRecordOwnership VALUES (DEFAULT, ?, ?, ?, ?)', [productName, -moneyToSpend, amount, playerId]);
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

// Requires amount field in req.body
router.post("/:name/sell", (req, res) => {
    var name = req.params.name;
    var amount = req.body.amount;

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;
    if (!loggedin) {
        res.status(401).send("Player not authorized!");
        return;
    }

    var amountNumber = Number(amount);
    if (amountNumber == 0 || amountNumber < 0){
        res.status(400).send("Please enter a positive number!");
        return;
    }
    if (isNaN(amountNumber)) {
        res.status(400).send("Please enter a number!");
        return;
    }
    var numDecimals = countDecimals(Number(noExponents(amount)));
    if (numDecimals > 5) {
        res.status(400).send("Please enter a number with less than 5 decimal places!");
        return;
    }

    var moneyEarned = null;
    var currentPrice = null;
    var amountOwned = null;
    var response = { code: null, message: null };
    // Get currentPrice of stock
    database.query('SELECT currentPrice FROM stock where name = ?', [name])
        .then(
            results => {
                if (results.length > 0) {
                    currentPrice = results[0].currentPrice;
                    // Get amountOwned of stock
                    return database.query('SELECT amount FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                } else {
                    response.code = 400;
                    response.message = "Stock not found!";
                    throw new Error("Stock not found!");
                }
            }
        ).then(
            results => {
                if (results.length > 0) {
                    amountOwned = results[0].amount;
                    var canSell = amountOwned >= amount;
                    if (!canSell) {
                        response.code = 403;
                        response.message = "Not enough amount owned to sell!"
                        throw new Error("Not enough amount owned to sell!");
                    }
                    var amountAfterSell = amountOwned - amount;
                    // Update stock amount or delete stock
                    if (amountAfterSell == 0) {
                        return database.query('DELETE FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name]);
                    } else {
                        return database.query('UPDATE playerStockR SET amount = amount - ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name]);
                    }
                } else {
                    response.code = 400;
                    response.message = "Stock amount owned by player not found!";
                    throw new Error("Stock amount owned by player not found!");
                }
            }
        ).then(
            results => {
                moneyEarned = currentPrice * amount;
                // Update player money
                return database.query('UPDATE playerOwnership SET money = money + ? WHERE playerId = ?', [moneyEarned, playerId]);
            }
        ).then(
            results => {
                var productName = "Stock " + name;
                // Insert transition record
                return database.query('INSERT INTO transitionRecordOwnership VALUES (now(), ?, ?, ?, ?)', [productName, moneyEarned, amount, playerId]);
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