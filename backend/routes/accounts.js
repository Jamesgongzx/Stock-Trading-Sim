const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/signup", async (req, res) => {

  var email = req.body.email.toLowerCase();
  var username = req.body.username;
  var password = req.body.password;
  var subscriptionType = req.body.subscriptionType;

  connection.query('SELECT * FROM account WHERE username = ?', [username], (error, results) => {
    if (error) {
      res.status(500).send("Unable to add account! SELECT failed.");
    } else if (results.length > 0) {
      res.status(409).send("Account already exists with that username!");
    } else {
      connection.query('INSERT INTO account VALUES (NULL, ?, ?, ?, DEFAULT)', [email, username, password], function (error, results) {
        if (error) {
          res.status(500).send("Account insertion failed.");
        } else {
          var accountId = results.insertId;
          connection.query('INSERT INTO user VALUES (?, ?)', [accountId, subscriptionType], function (error, result) {
            if (error) {
              res.status(500).send("User insertion failed.");
            } else {
              var money = 10000;
              if (subscriptionType == 'Premium') {
                money = 100000;
              }
              connection.query('INSERT INTO playerOwnership VALUES (NULL, ?, ?)', [money, accountId], function (error, results) {
                if (error) {
                  res.status(500).send("playerOwnership insertion failed.")
                } else {
                  res.status(200).send("Account added successfully!");
                }
              });
            }
          })
        }
      });
    }
  });
});

router.post("/signin", (req, res) => {

  var username = req.body.username;
  var password = req.body.password;

  var accountId = null;
  connection.query("SELECT accountId FROM account WHERE username = ? AND password = ?", [username, password], function (error, results) {
    if (error) {
      res.sendStatus(500);
      return;
    } else if (results.length > 0) {
      req.session.loggedin = true;
      req.session.accountId = results[0].accountId;
      accountId = req.session.accountId;
      req.session.save();
    } else {
      res.status(401).send("Incorrect Username and/or Password!");
      return;
    }
  });

  // Save subscriptionType if account is type user
  connection.query("SELECT subscriptionType FROM user WHERE accountId = ?", [accountId], function (error, results) {
    if (error) {
      res.sendStatus(500);
      return;
    } else if (results.length > 0) {
      req.session.subscriptionType = results[0].subscriptionType;
    }
  });


  res.status(200).send("Account signed in successfully");
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.status(200).send("User signed out successfully");
});

router.get("/players", (req, res) => {
  var accountId = req.session.accountId;
  console.log(req.session);
  connection.query('SELECT * FROM playerOwnership where accountId = ?', [accountId], (error, results) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.status(200).send(results);
    }
  });
});

router.get("/players/:playerId", (req, res) => {
  var accountId = req.session.accountId;
  var playerId = req.params.playerId;
  connection.query('SELECT * FROM playerOwnership where accountId = ? AND playerId = ?', [accountId, playerId], (error, results) => {
    if (error) {
      res.sendStatus(500);
    } else {
      req.session.playerId = playerId;
      res.status(200).send(results);
    }
  });
});

module.exports = router;