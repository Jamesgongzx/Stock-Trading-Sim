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
    if (playerId == req.session.playerId) {
        database.query('SELECT * FROM playerStockR WHERE playerId = ?', [playerId])
            .then(
                results => {
                    if (results.length > 0) {
                        res.status(200).send(results);
                    } else {
                        res.sendstatus(204);
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

router.get("/:playerId/items", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        database.query('SELECT * FROM playerItemR WHERE playerId = ?', [playerId])
            .then(
                results => {
                    if (results.length > 0) {
                        res.status(200).send(results);
                    } else {
                        res.sendstatus(204);
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
                        res.sendstatus(204);
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

router.get("/leaderBoards", (req, res) => {
    database.query('SELECT * FROM leaderboard', [])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/leaderboards", (req, res) => {
    database.query('SELECT * FROM leaderboard', [])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/leaderboards/:leaderboardId", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT * FROM leaderboard WHERE leaderboardId = ?', [leaderboardId])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/leaderboards/:leaderboardId/players", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT playerId, money, division FROM leaderboard,leaderboardR1,leaderboardR2 WHERE leaderboardId = ? ORDER BY money DESC', [leaderboardId])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

router.get("/:playerId/:leaderboardId/division", (req, res) => {
    var playerId = req.params.playerId;
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT division FROM leaderboardR1, leaderboardR2 WHERE playerId = ? AND leaderboardId = ?', [playerId, leaderboardId])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.sendstatus(204);
                }
            },
            error => {
                res.sendStatus(500);
            }
        )
});

module.exports = router;