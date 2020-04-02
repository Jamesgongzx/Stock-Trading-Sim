const express = require("express");
const database = require("../database");

const router = express.Router();

router.post("/signup", async (req, res) => {
    var email = req.body.email.toLowerCase();
    var username = req.body.username;
    var password = req.body.password;
    var subscriptionType = req.body.subscriptionType;
    var accountId;

    var response = { code: null, message: null };
    database.query('SELECT * FROM account WHERE username = ?', [username])
        .then(
            results => {
                if (results.length > 0) {
                    response.code = 409;
                    response.message = "Account already exists with that username!";
                    throw new Error(response.message);
                } else {
                    return database.query('INSERT INTO account VALUES (NULL, ?, ?, ?, DEFAULT)', [email, username, password])
                }
            })
        .then(
            results => {
                accountId = results.insertId;
                return database.query('INSERT INTO user VALUES (?, ?)', [accountId, subscriptionType]);
            },
            error => {
                database.queryError(error, response)
            })
        .then(
            results => {
                var money = 10000;
                if (subscriptionType == 'Premium') {
                    money = 100000;
                }
                return database.query('INSERT INTO playerOwnership VALUES (NULL, ?, ?)', [money, accountId]);
            })
        .then(
            results => {
                return res.status(200).send("Account added successfully!");
            })
        .catch(
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

router.post("/signin", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    var accountId = null;
    var response = { code: null, message: null };
    database.query("SELECT accountId FROM account WHERE username = ? AND password = ?", [username, password])
        .then(
            results => {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.accountId = results[0].accountId;
                    accountId = req.session.accountId;
                    return database.query("SELECT subscriptionType FROM user WHERE accountId = ?", [accountId]);
                } else {
                    response.code = 401;
                    response.message = "Incorrect Username and/or Password!";
                    throw new Error('Incorrect Username and/or Password!');
                }
            })
        .then(
            results => {
                if (results.length > 0) {
                    req.session.subscriptionType = results[0].subscriptionType;
                }
                req.session.save();
                return res.status(200).send("Account signed in successfully");
            })
        .catch(
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

router.get("/signout", (req, res) => {
    req.session.destroy();
    res.status(200).send("User signed out successfully");
});

router.get("/players", (req, res) => {
    var accountId = req.session.accountId;
    database.query('SELECT * FROM playerOwnership where accountId = ?', [accountId])
        .then(
            results => {
                res.status(200).send(results);
            },
            error => {
                console.log(error);
                res.sendStatus(500);
            }
        )
});

router.get("/players/:playerId", (req, res) => {
    var accountId = req.session.accountId;
    var playerId = req.params.playerId;
    database.query('SELECT * FROM playerOwnership where accountId = ? AND playerId = ?', [accountId, playerId])
        .then(
            results => {
                req.session.playerId = playerId;
                req.session.save();
                res.status(200).send(results);
            },
            error => {
                res.sendStatus(500);
            }
        )
});

module.exports = router;