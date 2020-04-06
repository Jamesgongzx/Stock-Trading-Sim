const express = require("express");
const database = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
    let adminId = req.session.adminId;
    var tableToJoin = req.query.projections;
    if (!adminId) {
        res.status(401).send("Player not authorized!");
        return;
    }

    if (!["itemRarity", "shopItemR", "playerItemR"].includes(tableToJoin)) {
        return res.status(403).send("Table to join is invalid!");
    }

    var onCondition = ""
    if (tableToJoin == "shopItemR" || tableToJoin == "playerItemR"){
        onCondition = "ON item.itemName = " + tableToJoin + ".itemName";
    } else if (tableToJoin == "itemRarity") {
        onCondition = "ON item.rarity = itemRarity.rarity";
    }

    database.query(
        `SELECT * FROM item JOIN ${tableToJoin} ` + onCondition, []
    ).then(
        (results) => {
            res.status(200).send(results);
        },
        (error) => {
            console.log(error);
            res.status(500).send("Internal Server Error!");
        }
    );
});

// itemName has to be encoded using encodeURIComponent()
router.patch("/:itemName/use", async (req, res) => {
    var itemName = req.params.itemName;
    itemName = decodeURIComponent(itemName);

    var playerId = req.session.playerId;
    var loggedin = req.session.loggedin;

    if (!loggedin) {
        res.status(401).send("Player not authorized!");
        return;
    }

    if (!["Infinity Gauntlet", "Apple", "GPU", "Potato Farm"].includes(itemName)) {
        return res.status(403).send("Item is not activatable!");
    }

    var amountOwned = 0;
    var amountToUse = 0;
    var moneyToEarn = 0;
    var response = { code: null, message: null, data: null };
    // Get item amountOwned by player
    return database.query('SELECT * FROM playerItemR where playerId = ? AND itemName = ?', [playerId, itemName])
        .then(
            // Use item
            results => {
                console.log(results);
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
                        response.message = "Not enough amount owned to use item!"
                        throw new Error("Not enough amount owned to use item!");
                    }

                    console.log(`amountToUse ${amountToUse}`);

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
                    console.log(`MoneytoEarn ${moneyToEarn}`);

                    // Check if usedToday
                    return database.query("SELECT * FROM playerItemR WHERE playerId = ? AND itemName = ?", [playerId, itemName]);
                } else {
                    response.code = 403;
                    response.message = "Item not owned!"
                    throw new Error("Item not owned!");
                }
            }
        ).then(
            results => {
                var usedToday = results[0].usedToday;
                if (usedToday && (itemName == "GPU" || itemName == "Potato Farm")) {
                    response.code = 403;
                    response.message = "Item already used today!"
                    throw new Error("Item already used today!");
                }

                if (itemName == "Infinity Gauntlet") {
                    return database.query(
                        "UPDATE playerOwnership " +
                        "SET money = money + ? " +
                        "WHERE playerId IN " +
                        "(SELECT distinct p.playerId " +
                        "FROM playerItemR as p " +
                        "WHERE NOT EXISTS " +
                        "(SELECT distinct i.itemName FROM item i WHERE i.itemName LIKE '%Gem' and not exists " +
                        "(SELECT pi.itemName FROM playerItemR pi WHERE pi.playerid = p.playerid AND pi.amount >= 1 AND pi.itemName LIKE '%Gem' and i.itemname = pi.itemname)))", [moneyToEarn]
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
                res.status(200).send("Used item!");
            }
        ).catch(
            error => {
                if (!response.code) {
                    response.code = 500;
                    response.message = "Internal Server Error";
                }
                console.log(error);
                console.log("here1");
                if (response.message) {
                    res.status(response.code).send(response.message);
                } else {
                    res.status(response.code);
                }
            }
        )
});

module.exports = router;