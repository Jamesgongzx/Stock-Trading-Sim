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
    employeeId INT UNIQUE AUTO_INCREMENT,
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
    playerId INT AUTO_INCREMENT PRIMARY KEY,
    money REAL NOT NULL,
    accountId INT NOT NULL,
    FOREIGN KEY (accountId)
        REFERENCES account (accountId)
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

CREATE EVENT updateStockEvent
    ON SCHEDULE EVERY 1 MINUTE DO
		UPDATE stock 
		SET currentPrice = (
			SELECT price 
			FROM stockRecordOwnership 
			WHERE stockRecordOwnership.name = stock.name 
			AND DAY(stockRecordOwnership.dateTime) = DAY(utc_time())
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(utc_time())
			AND MINUTE(stockRecordOwnership.dateTime) = MINUTE(utc_time())),
			24hChange = currentPrice - (
			SELECT price 
			FROM stockRecordOwnership 
			WHERE stockRecordOwnership.name = stock.name 
			AND DAY(stockRecordOwnership.dateTime) = DAY(utc_time()) - 1
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(utc_time())
			AND MINUTE(stockRecordOwnership.dateTime) = MINUTE(utc_time()));

INSERT INTO account VALUES (1, 'testAdmin1@testAdmin.com', 'testAdmin1', 'testAdmin1', DEFAULT),
(2, 'testAdmin2@testAdmin.com', 'testAdmin2', 'testAdmin2', DEFAULT),
(10, 'testUser1@testAdmin.com', 'testUser1', 'testUser1', DEFAULT),
(11, 'testUser2@testAdmin.com', 'testUser2', 'testUser2', DEFAULT);

INSERT INTO admin VALUES (1, NULL),
(2, NULL);

INSERT INTO user VALUES (10, 'None'),
(11, 'Premium');

INSERT INTO playerOwnership VALUES (1, 999999999999.99, 1),
(2, 999999999999.99, 2),
(3, 10000, 10),
(4, 100000, 11);

INSERT INTO stock VALUES ('AMZN', NULL, NULL);
INSERT INTO stockRecordOwnership VALUES 
('AMZN', '2020-01-31 00:33:00', 4000),
('AMZN', '2020-01-31 00:34:00', 5000),
('AMZN', '2020-01-31 00:35:00', 6000),
('AMZN', '2020-01-31 00:36:00', 7000),
('AMZN', '2020-01-30 00:33:00', 3000),
('AMZN', '2020-01-30 00:34:00', 2000),
('AMZN', '2020-01-30 00:35:00', 1000),
('AMZN', '2020-01-30 00:36:00', 0);
