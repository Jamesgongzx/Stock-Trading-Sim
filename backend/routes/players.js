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
        res.status(401).send("Player not authorized!");
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
                res.status(500).send("Internal Server Error!");
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
                res.status(500).send("Internal Server Error!");
            }
        )
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
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
                res.status(200).send("Player added successfully!");
            },
            error => {
                res.status(500).send("playerOwnership insertion failed.")
            }
        )
});

router.get("/:playerId/stocks", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId != req.session.playerId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query('SELECT stockName, amount FROM playerStockR WHERE playerId = ?', [playerId])
        .then(
            results => {
                if (results.length > 0) {
                    res.status(200).send(results);
                } else {
                    res.status(404).send("User not found!");
                }
            },
            error => {
                console.log(error);
                res.status(500).send("Internal Server Error!");
            }
        )
});

router.get("/history", (req, res) => {
    let playerId = req.session.playerId;
    if (playerId != req.session.playerId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    return database.query('SELECT dateTime, productName, quantity, balanceChange FROM transitionRecordOwnership WHERE playerId = ? order by datetime desc', [playerId])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error);
                res.status(500).send("Internal Server Error!");
            }
        )
})

router.get("/overview", (req, res) => {
    var adminId = req.session.adminId;
    var projections = req.query.projections;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }

    var projectionString = "";
    if (projections) {
        projectionString = projections.join();
    } else {
        projectionString = "*";
    }

    database.query(`select ${projectionString} ` +
        "from (select playerid, round(money, 2) as money, round(StockValuation, 2) as StockValuation, round(money + StockValuation, 2) as NetWorth " +
        "from (select po.playerId as playerId, money, case when StockValuation is null then 0 else StockValuation end as StockValuation  " +
        "from stocktradingsim.playerOwnership po left outer join (SELECT ps.playerId, sum(amount*currentprice) as StockValuation FROM stocktradingsim.playerStockR ps, stocktradingsim.stock s WHERE s.name = ps.stockName  " +
        "group by ps.playerId) p on p.playerId = po.playerId  " +
        "order by po.playerId) p) as p", [])
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

// returns a aggregate of how many stocks an account has
router.get("/:playerId/stocks/count", (req, res) => {
    let playerId = req.session.playerId;
    if (playerId != req.session.playerId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query("SELECT SUM(amount) AS total FROM playerStockR where playerId = ?", [playerId])
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

router.get("/:playerId/items", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId != req.session.playerId) {
        res.status(401).send("Player not authorized!");
        return;
    }
    database.query('SELECT itemName, amount AS amountOwned, usedToday FROM playerItemR WHERE playerId = ?', [playerId])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                res.status(500).send("Internal Server Error!");
            }
        )
});

module.exports = router;