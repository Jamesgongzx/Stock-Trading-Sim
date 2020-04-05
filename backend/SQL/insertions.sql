INSERT INTO account VALUES
(1, 'admin@admin.com', 'admin', 'admin', DEFAULT),
(2, 'admin2@admin2.com', 'admin2', 'admin2', DEFAULT),
(10, 'user@user.com', 'user', 'user', DEFAULT),
(11, 'user2@user2.com', 'user2', 'user2', DEFAULT);

INSERT INTO admin VALUES
(1, NULL),
(2, NULL);

INSERT INTO user VALUES (10, 'None'),
(11, 'Premium');

INSERT INTO playerOwnership VALUES (1, 999999999999.99, 1),
(2, 999999999999.99, 2),
(3, 10000, 10),
(4, 100000, 11),
(5, 10.0, 1),
(6, 999999999999.99, 1),
(7, 10000, 10),
(8, 100000, 10);

INSERT INTO playerRanking VALUES
(1,999999999999.99,0),
(2,999999999999.99,0),
(3,10000,0),
(4,100000,0);

INSERT INTO stock VALUES ('AAPL', 10000, 10000),
('AMZN', 10000, 10000),
('FB', 10000, 10000),
('GOOG', 10000, 10000),
('MSFT', 10000, 10000),
('SPY', 10000, 10000);

INSERT INTO company VALUES
('Amazon', 'Jeff', 'US', 'AMZN'),
('Google', 'Sundar', 'US', 'GOOG'),
('Apple', 'Tim', 'US', 'AAPL'),
('Facebook', 'Mark', 'US', 'FB'),
('Microsoft', 'Bill', 'US', 'MSFT');

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

INSERT INTO itemRarity VALUES
('Common', 'Gray', 1),
('Uncommon', 'Green', 0.33),
('Rare', 'Blue', 0.1),
('epic', 'Purple', 0.05),
('legendary', 'Orange', 0.01);

INSERT INTO shop VALUES
(2, 'Superstore:Regular', 'Superstore'),
(2, 'Superstore:Premium', 'Superstore(Premium)'),
(3, 'Superstore:Regular', 'Superstore'),
(3, 'Superstore:Premium', 'Superstore(Premium)'),
(4, 'Superstore:Regular', 'Superstore'),
(4, 'Superstore:Premium', 'Superstore(Premium)'),
(5, 'Superstore:Regular', 'Superstore'),
(5, 'Superstore:Premium', 'Superstore(Premium)'),
(6, 'Superstore:Regular', 'Superstore'),
(6, 'Superstore:Premium', 'Superstore(Premium)'),
(7, 'Superstore:Regular', 'Superstore'),
(7, 'Superstore:Premium', 'Superstore(Premium)'),
(7, 'Blackmarket:Regular', 'Blackmarket'),
(7, 'Blackmarket:Premium', 'Blackmarket(Premium)'),
(1, 'Superstore:Regular', 'Superstore'),
(1, 'Superstore:Premium', 'Superstore(Premium)'),
(1, 'Blackmarket:Regular', 'Blackmarket'),
(1, 'Blackmarket:Premium', 'Blackmarket(Premium)');

INSERT INTO playerStockR VALUES
(4, 'AAPL', 0.4),
(3, 'GOOG', 5),
(3, 'AMZN', 20),
(3, 'SPY', 30.3),
(1, 'FB', 5.98),
(1, 'MSFT', 20);

INSERT INTO shopItemR VALUES
('Potato Farm', 2, 'Superstore:Regular', 10, 10),
('Potato Farm', 3, 'Superstore:Regular', 10, 10),
('Potato Farm', 4, 'Superstore:Regular', 10, 10),
('Potato Farm', 5, 'Superstore:Regular', 10, 10),
('Potato Farm', 6, 'Superstore:Regular', 10, 10),
('Potato Farm', 7, 'Superstore:Regular', 10, 10),
('Potato Farm', 1, 'Superstore:Regular', 10, 10),
('GPU', 2, 'Superstore:Premium', 10, 10),
('GPU', 3, 'Superstore:Premium', 10, 10),
('GPU', 4, 'Superstore:Premium', 10, 10),
('GPU', 5, 'Superstore:Premium', 10, 10),
('GPU', 6, 'Superstore:Premium', 10, 10),
('GPU', 7, 'Superstore:Premium', 10, 10),
('GPU', 1, 'Superstore:Premium', 10, 10),
('Apple', 2, 'Superstore:Regular', 10, 10),
('Apple', 3, 'Superstore:Regular', 10, 10),
('Apple', 4, 'Superstore:Regular', 10, 10),
('Apple', 5, 'Superstore:Regular', 10, 10),
('Apple', 6, 'Superstore:Regular', 10, 10),
('Apple', 7, 'Superstore:Regular', 10, 10),
('Apple', 1, 'Superstore:Regular', 10, 10),
('Infinity Gauntlet', 1, 'Blackmarket:Premium', 2, 2),
('Time Gem', 7, 'Blackmarket:Premium', 2, 2),
('Space Gem', 7, 'Blackmarket:Premium', 2, 2),
('Soul Gem', 7, 'Blackmarket:Premium', 2, 2),
('Reality Gem', 1, 'Blackmarket:Premium', 2, 2),
('Power Gem', 1, 'Blackmarket:Premium', 2, 2),
('Mind Gem', 1, 'Blackmarket:Premium', 2, 2);

INSERT INTO playerItemR VALUES
(1, 'GPU', 2, false),
(1, 'Potato Farm', 5, false),
(1, 'Infinity Gauntlet', 1, false),
(1, 'Time Gem', 1, false),
(1, 'Space Gem', 1, false),
(1, 'Soul Gem', 1, false),
(1, 'Reality Gem', 1, false),
(1, 'Mind Gem', 1, false),
(1, 'Power Gem', 1, false),
(2, 'Potato Farm', 2, false),
(3, 'Potato Farm', 3, false),
(3, 'GPU', 5, false),
(3, 'Apple', 1, false),
(3, 'Time Gem', 1, false),
(3, 'Space Gem', 1, false),
(3, 'Soul Gem', 1, false),
(3, 'Reality Gem', 1, false),
(3, 'Mind Gem', 1, false),
(3, 'Power Gem', 1, false),
(3, 'Infinity Gauntlet', 1, false),
(4, 'Potato Farm', 4, false);

INSERT INTO transitionRecordOwnership VALUES
('2000-01-01 12:00:00', 'Stock AMZN', -10, 2, 1),
('2000-01-01 11:00:00', 'Stock AMZN', -25, 5, 1),
('2000-01-01 15:00:00', 'Apple', -10, 2, 1),
('2000-01-01 19:00:00', 'Potato Farm', -500, 5, 2),
('2000-01-01 13:15:00', 'Stock AMZN', -10, 2, 3),
('2000-01-01 14:00:00', 'Stock AMZN', -15, 3, 3),
('2010-01-01 16:15:00', 'Stock FB', -10, 1, 3),
('2000-01-01 17:00:00', 'Potato Farm', -200, 2, 3),
('2000-01-01 18:15:00', 'Stock FB', -20, 2, 4);

INSERT INTO transitionRecordOwnershipAlt VALUES
(1, '2000-01-01 12:00:00', 'Stock AMZN', 1),
(1, '2000-01-01 11:00:00', 'Stock AMZN', 2),
(1, '2000-01-01 15:00:00', 'Apple', 3),
(2, '2000-01-01 19:00:00', 'Potato Farm', 4),
(3, '2000-01-01 13:15:00', 'Stock AMZN', 5),
(3, '2000-01-01 14:00:00', 'Stock AMZN', 6),
(3, '2010-01-01 16:15:00', 'Stock FB', 7),
(3, '2000-01-01 17:00:00', 'Potato Farm', 8),
(4, '2000-01-01 18:15:00', 'Stock FB', 9);