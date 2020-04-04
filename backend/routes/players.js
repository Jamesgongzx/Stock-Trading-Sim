const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", async (req, res) => {
    // Schema = playerOwnership (playerId, money, accountId)
    // Example:
    // var projections = ["playerId", "money"];
    var projections = req.query.projections;
    var adminId = req.session.adminId;
    if (!adminId) {
        res.sendStatus(401);
        return;
    }

    var projectionString = "";
    if (projections) {
        projectionString = projections.join();
    } else {
        projectionString = "*";
    }

    database.query('SELECT ' + projectionString + ' FROM playerOwnership', [])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);

            }
        )
});

router.patch("/ranking", async (req, res) => {
    database.query('SET @r=0; UPDATE playerRanking SET ranking= (@r:= @r+1) ORDER BY money DESC;', [])
        .then(
            results => {
                return database.query('SELECT * FROM playerRanking ORDER BY ranking ASC', []);
            },
            error => {
                res.sendStatus(500);

            }
        )
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

router.get("/history", (req, res) => {
    let playerId = req.session.playerId;
    return database.query('SELECT * FROM transitionRecordOwnership WHERE playerId = ? order by datetime desc', [playerId])
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
})

router.get("/overview", (req, res) => {
    var adminId = req.session.adminId;
    var projections = req.query.projections;
    if (!adminId) {
        res.sendStatus(401);
        return;
    }

    var projectionString = "";
    if (projections) {
        projectionString = projections.join();
    } else {
        projectionString = "*";
    }

    database.query(`select ${projectionString} ` +
        "from (select playerid, money, StockValuation, money + StockValuation as NetWorth " +
        "from (select po.playerId as playerId, money, case when StockValuation is null then 0 else StockValuation end as StockValuation  " +
        "from stocktradingsim.playerOwnership po left outer join (SELECT ps.playerId, sum(amount*currentprice) as StockValuation FROM stocktradingsim.playerStockR ps, stocktradingsim.stock s WHERE s.name = ps.stockName  " +
        "group by ps.playerId) p on p.playerId = po.playerId  " +
        "order by po.playerId) p) as p", [])
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

// returns a aggregate of how many stocks an account has
router.get("/:playerId/stocks/count", (req, res) => {
    let playerId = req.session.playerId;
    console.log(playerId);
    if (playerId == req.session.playerId) {
        database.query("SELECT SUM(amount) AS total FROM playerStockR where playerId = ?", [playerId])
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
        database.query('SELECT transitionID, dateTime, productName, quantity, balanceChange FROM transitionRecordOwnership WHERE playerId = ?', [playerId])
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