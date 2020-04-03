ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

DROP DATABASE IF EXISTS stocktradingsim;
CREATE DATABASE IF NOT EXISTS stocktradingsim DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SET default_storage_engine=InnoDB;
USE stocktradingsim;

SET GLOBAL time_zone = '+00:00';
SET SQL_SAFE_UPDATES = 0;

CREATE TABLE account (
    accountId INT AUTO_INCREMENT PRIMARY KEY,
    email CHAR(50) NOT NULL,
    username CHAR(50) NOT NULL UNIQUE,
    password CHAR(50) NOT NULL,
    registrationTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP () ON UPDATE CURRENT_TIMESTAMP ()
);

CREATE TABLE admin (
    accountId INT PRIMARY KEY,
    adminId INT UNIQUE AUTO_INCREMENT,
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE user (
    accountId INT PRIMARY KEY,
    subscriptionType CHAR(20) NOT NULL,
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerOwnership (
    playerId INT AUTO_INCREMENT,
    money REAL NOT NULL,
    accountId INT NOT NULL,
    PRIMARY KEY(playerId, money),
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerRanking(
	playerId INT AUTO_INCREMENT PRIMARY KEY,
    money REAL NOT NULL,
    ranking INT NOT NULL,
    FOREIGN KEY (playerId, money)
        REFERENCES playerOwnership (playerId, money)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE stock (
    name CHAR(20) PRIMARY KEY,
    currentPrice REAL,
    24hChange REAL
);

CREATE TABLE stockRecordOwnership (
    name CHAR(20),
    dateTime DATETIME,
    price REAL,
    PRIMARY KEY (name , dateTime),
    FOREIGN KEY (name)
        REFERENCES stock (name)
        ON UPDATE CASCADE ON DELETE CASCADE
);

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
(4, 100000, 11);

INSERT INTO stock VALUES ('AMZN', 10, 10);
INSERT INTO stockRecordOwnership VALUES
('AMZN', '2020-01-31 00:33:00', 4000),
('AMZN', '2020-01-31 00:34:00', 5000),
('AMZN', '2020-01-31 00:35:00', 6000),
('AMZN', '2020-01-31 00:36:00', 7000),
('AMZN', '2020-01-30 00:33:00', 3000),
('AMZN', '2020-01-30 00:34:00', 2000),
('AMZN', '2020-01-30 00:35:00', 1000),
('AMZN', '2020-01-30 00:36:00', 0);

INSERT INTO playerRanking VALUES
(1,999999999999.99,1),
(2,999999999999.99,2),
(3,10000,4),
(4,100000,3);