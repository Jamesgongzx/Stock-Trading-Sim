const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.get("/", async (req, res) => {
    connection.query('SELECT * FROM playerOwnership', (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.status(200).send(results);
        }
    });
});

router.get("/:playerId/stocks", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        connection.query('SELECT * FROM playerStockR WHERE playerId = ?', [playerId], (error, results) => {
            if (error) {
                res.sendStatus(500);
            } else if (results.length > 0) {
                res.status(200).send(results);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

router.get("/:playerId/items", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        connection.query('SELECT * FROM playerItemR WHERE playerId = ?', [playerId], (error, results) => {
            if (error) {
                res.sendStatus(500);
            } else if (results.length > 0) {
                res.status(200).send(results);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

router.get("/:playerId/records", (req, res) => {
    var playerId = req.params.playerId;
    if (playerId == req.session.playerId) {
        connection.query('SELECT transitionID, dateTime, productName, quantity, balanceChange FROM transitionRecordOwnershipR1, transitionRecordOwnershipR2 WHERE playerId = ?', [playerId], (error, results) => {
            if (error) {
                res.sendStatus(500);
            } else if (results.length > 0) {
                res.status(200).send(results);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

router.get("/leaderBoards", (req, res) => {
    connection.query('SELECT * FROM leaderboard', (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/leaderboards", (req, res) => {
    connection.query('SELECT * FROM leaderboard', (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/leaderboards/:leaderboardId", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    connection.query('SELECT * FROM leaderboard WHERE leaderboardId = ?', [leaderboardId], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/leaderboards/:leaderboardId/players", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    connection.query('SELECT playerId, money, division FROM leaderboard,leaderboardR1,leaderboardR2 WHERE leaderboardId = ? ORDER BY money DESC', [leaderboardId], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

router.get("/:playerId/:leaderboardId/division", (req, res) => {
    var playerId = req.params.playerId;
    var leaderboardId = req.params.leaderboardId;
    connection.query('SELECT division FROM leaderboardR1, leaderboardR2 WHERE playerId = ? AND leaderboardId = ?', [playerId, leaderboardId], (error, results) => {
        if (error) {
            res.sendStatus(500);
        } else if (results.length > 0) {
            res.status(200).send(results);
        }
    });
});

module.exports = router;