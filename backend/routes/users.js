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
      res.status(400).json({ error: "Unable to add account! SELECT failed." });
    } else if (results.length > 0) {
      res.status(409).json({ error: "Account already exists with that username!" });
    } else {
      connection.query('INSERT INTO account VALUES (NULL, ?, ?, ?, DEFAULT)', [email, username, password], function (error, results) {
        if (error) {
          res.status(400).json({ error: "Unable to add account! INSERT failed." });
        } else {
          var accountId = results.insertId;
          connection.query('INSERT INTO user VALUES (?, ?)', [accountId, subscriptionType], function (error, result) {
            if (error) {
              res.status(400).json({ error: "Unable to add user! INSERT failed." });
            } else {
              res.status(200).json({ message: "Account added successfully!" });
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

  connection.query("SELECT * FROM account WHERE username = ? AND password = ?", [username, password], function (error, results, fields) {
    if (results.length > 0) {
      res.status(200).json({ message: "User logged in successfully" });
      // TODO: Create session variables and redirect
    } else {
      res.status(400).json({ error: "Incorrect Username and/or Password!" });
    }
  });
});

module.exports = router;

