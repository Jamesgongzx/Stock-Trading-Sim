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
    connection.query('SELECT currentPrice FROM stock where name = ?', [name], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            currentPrice = results[0].currentPrice;
        } else {
            res.sendStatus(400);
            return;
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

    var canPurchase = (currentPrice * amount) >= money;

    if (!canPurchase) {
        res.sendStatus(403);
        return;
    }

    // Check if player already owns stock
    var alreadyOwned = null;
    connection.query('SELECT * FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            alreadyOwned = true;
        }
    });

    if (alreadyOwned) {
        connection.query('UPDATE playerStockR SET amount = amount + ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        connection.query('INSERT INTO playerStockR VALUES (?, ?, ?)', [playerId, name, amount], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            } else {
                res.sendStatus(200);
            }
        });
    }
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
    connection.query('SELECT currentPrice FROM stock where name = ?', [name], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            currentPrice = results[0].currentPrice;
        } else {
            res.sendStatus(400);
            return;
        }
    });

    var amountOwned = null;
    connection.query('SELECT amount FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else if (results.length > 0) {
            amountOwned = results[0].amount;
        }
    });

    var canSell = amountOwned >= amount;
    if (!canSell) {
        res.sendStatus(403);
        return;
    }

    var amountAfterSell = amountOwned - amount;
    if (amountAfterSell == 0) {
        connection.query('DELETE FROM playerStockR WHERE playerId = ? AND stockName = ?', [playerId, name], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            }
        });
    } else {
        connection.query('UPDATE playerStockR SET amount = amount - ? WHERE playerId = ? AND stockName = ?', [amount, playerId, name], (error, results) => {
            if (error) {
                res.sendStatus(500);
                return;
            }
        });
    }

    var moneyEarned = currentPrice * amount;
    connection.query('UPDATE playerOwnership SET money = money + ? WHERE playerId = ?', [moneyEarned, playerId], (error, results) => {
        if (error) {
            res.sendStatus(500);
            return;
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;