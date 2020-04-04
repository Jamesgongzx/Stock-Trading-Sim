ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
SET default_storage_engine=InnoDB;
USE stocktradingsim;

CREATE TABLE company (
    Name CHAR(50) primary key,
    CEO CHAR(50),
    CountryOrigin CHAR(20),
    stockName CHAR(20) NOT NULL UNQIUE,
    Foreign key (stockName) references stock (name) ON UPDATE CASCADE
    ON DELETE CASCADE,
    Unique (stockName)
);

CREATE TABLE transitionRecordOwnership (
    dateTime DATETIME,
  	productName CHAR(50),
  	playerId INT NOT NULL,
    balanceChange INT,
    quantity INT,
    Primary key (playerId, productName, dateTime),
    Foreign key (playerId) references playerOwnership
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE transitionRecordOwnershipAlt (
    playerID INT NOT NULL,
    dateTime DATETIME,
    productName CHAR(50),
    transitionID INT,

    Primary key (playerID, transitionID, dateTime),
    Foreign key (playerID) references playerOwnership
    ON UPDATE CASCADE ON DELETE CASCADE,
    Foreign key (dateTime, productName) references
    transitionRecordOwnership(dateTime, productName)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE item (
    itemName CHAR(50) primary key,
    cost REAL,
    description CHAR(300)
    rarity CHAR(20)
);


/* 
CREATE TABLE itemColor (
    rarity CHAR(20) primary key,
    color CHAR(30), ''''''
    Foreign key (rarity) references item
    ON UPDATE CASCADE ON DELETE CASCADE
);
*/


CREATE TABLE shop (
    dayOfWeek INT,
  	category CHAR(50),
  	shopName CHAR(50),
  	Primary key (dayOfWeek, category)
);

CREATE TABLE shopItemR (
    itemName CHAR(50),
    dayOfWeek INT,
    category CHAR(50),
    amount INT,
    Primary key (itemName, dayOfWeek, category),
    Foreign key (itemName) references item ON UPDATE CASCADE
    ON DELETE CASCADE,
    Foreign key (dayOfWeek, category) references shop(dayOfWeek, category)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerItemR (
    playerID INT,
  	itemName CHAR(50),
  	Amount INT,
    usedToday BOOLEAN,
  	Primary key (playerID, itemName),
    Foreign key (playerID) references playerOwnership
    ON UPDATE CASCADE ON DELETE CASCADE,
  	Foreign key (itemName) references item ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE playerStockR (
    playerId INT,
    stockName CHAR(20),
    amount INT,
    PRIMARY KEY (playerId , stockName),
    FOREIGN KEY (stockName) REFERENCES stock (name)
      ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (playerId) REFERENCES playerOwnership
      ON UPDATE CASCADE ON DELETE CASCADE,
);




INSERT INTO company VALUES
('Amazon', 'Jeff', 'US', 'Amazon'),
('Google', 'Sundar', 'US', 'Google'),
('Baidu', 'Robin', 'China', 'Baidu'),
('Apple', 'Tim', 'US', 'Apple'),
('Microsoft', 'Bill', 'US', 'Microsoft');

INSERT INTO transitionRecordOwnership VALUES
('2020-02-01 05:45:00', 'Amazon stock', 1, -1800, 1),
('2020-03-01 05:45:00', 'Google stock', 3, -2500, 2),
('2020-02-07 05:45:00', 'Dynamite', 2, -10000, 2),
('2020-02-01 15:45:00', 'Gun', 5, -20000, 1),
('2020-02-01 05:42:00', 'Baidu stock', 4, -20000, 17);

INSERT INTO transitionRecordOwnershipAlt VALUES
(1, '2020-02-01 05:45:00', 'Amazon stock', 1),
(3, '2020-03-01 05:45:00', 'Google stock', 2),
(2, '2020-02-07 05:45:00', 'Dynamite', 3),
(5, '2020-02-01 15:45:00', 'Gun', 4),
(4, '2020-02-01 05:42:00', 'Baidu stock', 5);

INSERT INTO item VALUES
('Infinity Gauntlet', 5000, 'Add 10000 money to players who owns all gems.', 'legendary'),
('Time Gem', 2000, '[Not activatable] Total control over all
  aspects of time including time travel, stopping time, slowing
  down or speed up the flow of time and to accelerate or slow down ageing.', 'epic'),
('Space Gem', 2000, '[Not activatable] Limitless manipulation of space, allowing for teleportation,
  dimensional manipulation, the creation of wormholes, etc.', 'epic'),
('Soul Gem', 2000, '[Not activatable] Limitless manipulation of souls both alive and dead also has
   shown to be able to evolve or devolve a beings physical self as well.', 'epic'),
('Reality Gem', 2000, '[Not activatable] Locally or universally alters the natural
  laws of the universe to the wielders will.', 'epic'),
('Power Gem', 2000, '[Not activatable] Controls all of the power in the universe.
  It can be used to augment or inhibit any force.', 'epic'),
('Mind Gem', 2000, '[Not activatable] Taps the user into the universal consciousness, allowing for
  unlimited manipulation of psionic powers including telepathy and telekinesis.', 'epic'),
('Apple', 1, 'Something happens when you collect 100 apples.', 'Common'),
('Potato Farm', 100, '[Activatable once per day] Increase money by 5 per amount owned.', 'Uncommon'),
('GPU', 1000, '[Activatable once per day] Farm bitcoin. Increase money by 75 per amount owned.', 'Rare');


INSERT INTO shop VALUES
(1, 'Weapons:Regular', 'Armory'),
(1, 'Weapons:Premium', 'Armory(Premium)'),
(5, 'Supermarket:Regular', 'Supermarket'),
(7, 'Electronics:Regular', 'Electronics'),
(7, 'Electronics:Premium', 'Electronics(Premium)');


INSERT INTO shopItemR VALUES
('PotatoFarm', 1, 'Supermarket:Regular', 10),
('PotatoFarm', 1, 'Supermarket:Premium', 100),
('PotatoFarm', 3, 'Supermarket:Regular', 20),
('GPU', 7, 'Electronics:Regular', 10),
('GPU', 7, 'Electronics:Premium', 100);


INSERT INTO playerItemR VALUES
(1, 'GPU', 2, FALSE),
(1, 'Potato Farm', 1, FALSE),
(2, 'Potato Farm', 2, FALSE),
(3, 'Potato Farm', 3, FALSE),
(4, 'Potato Farm', 4, FALSE);

INSERT INTO playerItemR VALUES
(1, 'Amazon', 1),
(2, 'Amazon', 2),
(3, 'Amazon', 3),
(4, 'Amazon', 4),
(5, 'Google', 5);
