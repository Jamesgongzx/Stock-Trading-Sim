const express = require("express");
const database = require("../database");

const router = express.Router();

// itemName has to be encoded using encodeURIComponent()
router.patch("/:itemName/use", async (req, res) => {
    var itemName = req.params.itemName;
    itemName = decodeURIComponent(itemName);

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    if (!["Infinity Gauntlet", "Apple", "GPU", "Potato Farm"].includes(itemName)) {
        return res.status(200).send("Nothing happened!");
    }

    var amountOwned = 0;
    var amountToUse = 0;
    var moneyToEarn = 0;
    var response = { code: null, message: null };
    // Get item amountOwned by player
    database.query('SELECT * FROM playerItemR where playerId = ? AND itemName = ?', [playerId, itemName])
        .then(
            // Use item
            results => {
                if (results.length > 0) {

                    amountOwned = results[0].amount;
                    amountToUse = 1;
                    if (itemName == "Apple") {
                        amountToUse = 100;
                    } else if (itemName == "GPU" || itemName == "Potato Farm") {
                        amountToUse = amountOwned;
                    }

                    if (amountOwned < amountToUse) {
                        response.code = 403;
                        response.message = "Not enough amount owned to activate item!"
                        throw new Error("Not enough amount owned to activate item!");
                    }

                    moneyToEarn = 0;
                    if (itemName == "Infinity Gauntlet") {
                        moneyToEarn = 10000;
                    } else if (itemName == "Apple") {
                        moneyToEarn = 10000;
                    } else if (itemName == "GPU") {
                        moneyToEarn = 75 * amountToUse;
                    } else if (itemName == "Potato Farm") {
                        moneyToEarn = 5 * amountToUse;
                    }

                    // Check if usedToday
                    return database.query("SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?", [playerId, itemName]);
                } else {
                    response.code = 403;
                    response.message = "Item not owned"
                    throw new Error("Item not owned");
                }
            }
        ).then(
            results => {
                var usedToday = results[0].usedToday;
                if (usedToday) {
                    response.code = 403;
                    response.message = "Item already used today"
                    throw new Error("Item already used today");
                }

                if (itemName == "Infinity Gauntlet") {
                    return database.query(
                        "UPDATE playerOwnership " +
                        "SET money = money + ? " +
                        "WHERE playerId IN " +
                        "(SELECT p.playerId AS FROM playerItemR as p " +
                        "WHERE NOT EXISTS ( " +
                        "( SELECT i.itemName FROM item as i " +
                        "WHERE i.itemName LIKE '%Gem') " +
                        "EXCEPT " +
                        "(SELECT pi.itemName FROM playerItemR as pi " +
                        "WHERE pi.playerid = p.playerid AND pi.amount >= 1 AND pi.itemName LIKE '%Gem')))", [moneyToEarn]
                    );
                } else if (itemName == "Apple") {
                    return database.query("UPDATE playerOwnership SET money = money + ? WHERE playerId = ?", [moneyToEarn, playerId]);
                } else if (itemName == "GPU") {
                    return database.query("UPDATE playerOwnership SET money = money + ? WHERE playerId = ?", [moneyToEarn, playerId]);
                } else if (itemName == "Potato Farm") {
                    return database.query("UPDATE playerOwnership SET money = money + ? WHERE playerId = ?", [moneyToEarn, playerId]);
                } else {
                    throw new Error("Error should not have been thrown");
                }
            }
        ).then(
            // Update item count or delete item after use
            results => {
                var amountAfterUse = amountOwned;
                if (itemName != "GPU" && itemName != "Potato Farm") {
                    amountAfterUse = amountOwned - amountToUse;
                }

                if (amountAfterUse <= 0) {
                    return database.query('DELETE FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, itemName]);
                } else {
                    return database.query('UPDATE playerItemR SET amount = ?, usedToday = true WHERE playerId = ? AND itemName = ?', [amountAfterUse, playerId, itemName]);
                }
            }
        ).then(
            results => {
                res.sendStatus(200);
            }
        ).catch(
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

module.exports = router;