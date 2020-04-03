const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    database.query('SELECT * FROM leaderboard', [])
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

router.get("/:leaderboardId", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT * FROM leaderboard WHERE leaderboardId = ?', [leaderboardId])
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

router.get("/:leaderboardId/players", (req, res) => {
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT playerId, money, division FROM leaderboard,leaderboardR1,leaderboardR2 WHERE leaderboardId = ? ORDER BY money DESC', [leaderboardId])
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

router.get("/:leaderboardId/players/:playerId/division", (req, res) => {
    var playerId = req.params.playerId;
    var leaderboardId = req.params.leaderboardId;

    database.query('SELECT division FROM leaderboardR1, leaderboardR2 WHERE playerId = ? AND leaderboardId = ?', [playerId, leaderboardId])
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

module.exports = router;