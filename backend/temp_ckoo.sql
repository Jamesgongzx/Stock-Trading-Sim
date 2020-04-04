ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
SET default_storage_engine=InnoDB;
USE stocktradingsim;

INSERT INTO playerOwnership VALUES
(5, 10.0, 1),
(6, 999999999999.99, 1),
(7, 10000, 10),
(8, 100000, 10);

INSERT INTO stock VALUES
('GOOGL', 50.24, 2.4),
('HELLOWORLD', 60.50, -2.5);


CREATE TABLE playerStockR (
    playerId INT,
    stockname CHAR(20),
    amount INT,
    PRIMARY KEY (playerId , stockname),
    FOREIGN KEY (stockname)
        REFERENCES stock (name)
        ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO playerStockR VALUES
(3, 'GOOGL', 5),
(3, 'AMZN', 20),
(3, 'HELLOWORLD', 30),
(1, 'GOOGL', 5),
(1, 'AMZN', 20);


CREATE TABLE item (
    itemName CHAR(50) primary key,
    cost REAL,
    description TEXT,
    rarity CHAR(20)
);

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
    Foreign key (itemName) references item(itemName) ON UPDATE CASCADE
    ON DELETE CASCADE,
    Foreign key (dayOfWeek, category) references shop(dayOfWeek, category)
    ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO item VALUES
('Infinity Gauntlet', 5000, 'Add 10000 money to players who owns all gems.', 'legendary'),
('Time Gem', 2000, '[Not activatable] Total control over all aspects of time including time travel, stopping time, slowing down or speed up the flow of time and to accelerate or slow down ageing.', 'epic'),
('Space Gem', 2000, '[Not activatable] Limitless manipulation of space, allowing for teleportation, dimensional manipulation, the creation of wormholes, etc.', 'epic'),
('Soul Gem', 2000, '[Not activatable] Limitless manipulation of souls both alive and dead also has shown to be able to evolve or devolve a beings physical self as well.', 'epic'),
('Reality Gem', 2000, '[Not activatable] Locally or universally alters the natural laws of the universe to the wielders will.', 'epic'),
('Power Gem', 2000, '[Not activatable] Controls all of the power in the universe. It can be used to augment or inhibit any force.', 'epic'),
('Mind Gem', 2000, '[Not activatable] Taps the user into the universal consciousness, allowing for unlimited manipulation of psionic powers including telepathy and telekinesis.', 'epic'),
('Apple', 1, 'Something happens when you collect 100 apples.', 'Common'),
('Potato Farm', 100, '[Activatable once per day] Increase money by 5 per amount owned.', 'Uncommon'),
('GPU', 1000, '[Activatable once per day] Farm bitcoin. Increase money by 75 per amount owned.', 'Rare');


INSERT INTO shop VALUES
(1, 'Weapons:Regular', 'Armory'),
(1, 'Weapons:Premium', 'Armory(Premium)'),
(1, 'Supermarket:Premium', 'Supermarket'),
(3, 'Supermarket:Premium', 'Supermarket'),
(7, 'Electronics:Regular', 'Electronics'),
(7, 'Electronics:Premium', 'Electronics(Premium)'),
(2, 'Supermarket:Premium', 'Supermarket'),

(1, 'Supermarket:Regular', 'Supermarket'),
(2, 'Supermarket:Regular', 'Supermarket'),
(3, 'Supermarket:Regular', 'Supermarket'),
(4, 'Supermarket:Regular', 'Supermarket'),
(5, 'Supermarket:Regular', 'Supermarket'),
(6, 'Supermarket:Regular', 'Supermarket'),
(7, 'Supermarket:Regular', 'Supermarket');


INSERT INTO shopItemR VALUES
('Potato Farm', 1, 'Supermarket:Regular', 10),
('Infinity Gauntlet', 1, 'Supermarket:Regular', 2),
('Time Gem', 1, 'Supermarket:Regular', 3),
('Space Gem', 1, 'Supermarket:Regular', 4),
('Soul Gem', 1, 'Supermarket:Regular', 2),
('Reality Gem', 1, 'Supermarket:Regular', 1),
('Power Gem', 1, 'Supermarket:Regular', 5),
('Mind Gem', 1, 'Supermarket:Regular', 6),
('Apple', 1, 'Supermarket:Regular', 10),
('GPU', 1, 'Supermarket:Regular', 10),
('Power Gem', 2, 'Supermarket:Premium', 100),
('Potato Farm', 2, 'Supermarket:Regular', 10),
('Infinity Gauntlet', 2, 'Supermarket:Regular', 2),
('Time Gem', 2, 'Supermarket:Regular', 3),
('Space Gem', 2, 'Supermarket:Regular', 4),
('Soul Gem', 2, 'Supermarket:Regular', 2),
('Reality Gem', 2, 'Supermarket:Regular', 1),
('Power Gem', 2, 'Supermarket:Regular', 5),
('Mind Gem', 2, 'Supermarket:Regular', 6),
('Apple', 2, 'Supermarket:Regular', 10),
('GPU', 2, 'Supermarket:Regular', 10),
('Potato Farm', 3, 'Supermarket:Regular', 10),
('Infinity Gauntlet', 3, 'Supermarket:Regular', 2),
('Time Gem', 3, 'Supermarket:Regular', 3),
('Space Gem', 3, 'Supermarket:Regular', 4),
('Soul Gem', 3, 'Supermarket:Regular', 2),
('Reality Gem', 3, 'Supermarket:Regular', 1),
('Power Gem', 3, 'Supermarket:Regular', 5),
('Mind Gem', 3, 'Supermarket:Regular', 6),
('Apple', 3, 'Supermarket:Regular', 10),
('GPU', 3, 'Supermarket:Regular', 10),
('Potato Farm', 5, 'Supermarket:Regular', 10),
('Infinity Gauntlet', 5, 'Supermarket:Regular', 2),
('Time Gem', 5, 'Supermarket:Regular', 3),
('Space Gem', 5, 'Supermarket:Regular', 4),
('Soul Gem', 5, 'Supermarket:Regular', 2),
('Reality Gem', 5, 'Supermarket:Regular', 1),
('Power Gem', 5, 'Supermarket:Regular', 5),
('Mind Gem', 5, 'Supermarket:Regular', 6),
('Apple', 5, 'Supermarket:Regular', 10),
('GPU', 7, 'Electronics:Regular', 10),
('GPU', 7, 'Electronics:Premium', 100);


CREATE TABLE playerItemR (
    playerID INT,
 	itemName CHAR(50),
  	amount INT,
    usedToday BOOLEAN,
  	Primary key (playerID, itemName),
    Foreign key (playerID) references playerOwnership(playerID)
    	ON UPDATE CASCADE ON DELETE CASCADE,
    Foreign key (itemName) references item(itemName) ON UPDATE CASCADE
   	ON DELETE CASCADE
);

INSERT INTO playerItemR VALUES
(1, 'GPU', 2, FALSE),
(1, 'Potato Farm', 1, FALSE),
(2, 'Potato Farm', 2, FALSE),
(3, 'Potato Farm', 3, FALSE),
(3, 'GPU', 5, FALSE),
(3, 'Time Gem', 1, FALSE),
(3, 'Space Gem', 1, FALSE),
(3, 'Soul Gem', 1, FALSE),
(3, 'Reality Gem', 1, FALSE),
(3, 'Mind Gem', 1, FALSE),
(3, 'Apple', 1, FALSE),
(3, 'Power Gem', 1, FALSE),
(3, 'Infinity Gauntlet', 1, FALSE),
(4, 'Potato Farm', 4, FALSE);
