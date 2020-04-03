const express = require("express");
const database = require("../database");

const router = express.Router();

// itemName has to be encoded using encodeURIComponent()
router.get("/:itemName/use", async (req, res) => {
    var itemName = req.params.itemName;
    itemName = decodeURIComponent(itemName);

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.sendStatus(401);
        return;
    }

    if (!["Infinity Gauntlet"].includes(itemName)) {
        return res.status(200).send("This item does not do anything!");
    }
    
    var amountOwned = 0;
    var response = { code: null, message: null };
    database.query('SELECT * FROM playerItemR where playerId = ? AND itemName = ?', [playerId, itemName])
        .then(
            // Use item
            results => {
                if (results.length > 0 && results[0].amount >= 1) {
                    amountOwned = results[0].amount;
                    if (itemName == "Infinity Gauntlet") {
                        return database.query(
                            "UPDATE playerOwnership " +
                            "SET money = money + 10000 " +
                            "WHERE playerId IN " +
                            "(SELECT p.playerId AS FROM playerItemR as p " +
                            "WHERE NOT EXISTS ( " +
                            "( SELECT i.itemName FROM item as i " +
                            "WHERE i.itemName LIKE '%Gem') " +
                            "EXCEPT " +
                            "(SELECT pi.itemName FROM playerItemR as pi " +
                            "WHERE pi.playerid = p.playerid AND pi.amount >= 1 AND pi.itemName LIKE '%Gem')))"
                        );
                    }
                } else {
                    response.code = 403;
                    response.message = "Item not owned"
                    throw new Error("Item not owned");
                }
            }
        ).then(
            // Update item count or delete item after use
            results => {
                var amountAfterUse = amountOwned - 1;
                if (amountAfterUse <= 0) {
                    return database.query('DELETE FROM playerItemR WHERE playerId = ? AND itemName = ?', [playerId, itemName]);
                } else {
                    return database.query('UPDATE playerItemR SET amount = amount - 1 WHERE playerId = ? AND itemName = ?', [playerId, itemName]);
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