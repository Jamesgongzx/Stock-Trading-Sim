const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", async (req, res) => {
    database.query('SELECT * FROM stock', [])
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

// returns a aggregate of how many stocks an account has
router.get("/stock-count", (req, res) => {
    let playerId = req.session.playerId;
    console.log(playerId);
    let loggedin = req.session.loggedin;
    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    return database.query("SELECT sum(amount) as total FROM playerStockR where playerId = ?", [playerId])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
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

// delete stock (admin only)
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
                    var canPurchase = money >= (currentPrice * amount) ;
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