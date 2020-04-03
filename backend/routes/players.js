const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", async (req, res) => {
    database.query('SELECT * FROM playerOwnership', [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);

            }
        )
});

router.post("/create", async (req, res) => {
    var money = 999999999999.99;
    var accountId = req.session.accountId;
    var subscriptionType = req.session.subscriptionType;
    if (subscriptionType) {
        if (subscriptionType == "None") {
            money = 10000;
        } else if (subscriptionType == "Premium") {
            money = 100000;
        }
    }

    database.query('INSERT INTO playerOwnership VALUES (NULL, ?, ?)', [money, accountId])
        .then(
            results => {
                res.status(200).send("Account added successfully!");
            },
            error => {
                res.status(500).send("playerOwnership insertion failed.")
            }
        )
});

router.get("/:playerId/stocks", (req, res) => {
    var playerId = req.params.playerId;
    console.log(req.params);
    console.log(req.session);
    if (playerId == req.session.playerId) {
        database.query('SELECT * FROM playerStockR WHERE playerId = ?', [playerId])
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
    } else {
        res.sendStatus(401);
    }
});

// returns a aggregate of how many stocks an account has
router.get("/:playerId/stocks/count", (req, res) => {
    let playerId = req.session.playerId;
    console.log(playerId);
    if (playerId == req.session.playerId) {
        database.query("SELECT SUM(amount) as total FROM playerStockR where playerId = ?", [playerId])
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
    } else {
        res.sendStatus(401);
    }
});

router.get("/:playerId/items", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        database.query('SELECT * FROM playerItemR WHERE playerId = ?', [playerId])
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
    } else {
        res.sendStatus(401);
    }
});

router.get("/:playerId/records", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        database.query('SELECT transitionID, dateTime, productName, quantity, balanceChange FROM transitionRecordOwnershipR1, transitionRecordOwnershipR2 WHERE playerId = ?', [playerId])
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
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;