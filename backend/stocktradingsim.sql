ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

DROP DATABASE IF EXISTS stocktradingsim;
CREATE DATABASE IF NOT EXISTS stocktradingsim DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
SET default_storage_engine=InnoDB;
USE stocktradingsim;

CREATE TABLE account (
  accountId INT AUTO_INCREMENT PRIMARY KEY,
  email CHAR(50) NOT NULL,
  username CHAR(50) NOT NULL UNIQUE,
  password CHAR(50) NOT NULL,
  registrationTime timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
);

CREATE TABLE admin (
    accountId INT PRIMARY KEY,
    employeeId INT UNIQUE AUTO_INCREMENT,
    FOREIGN KEY (accountId) REFERENCES account(accountId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE user (
    accountId INT PRIMARY KEY,
    subscriptionType CHAR(20) NOT NULL,
    FOREIGN KEY (accountId) REFERENCES account(accountId) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE playerOwnership (
	playerId INT AUTO_INCREMENT PRIMARY KEY,
    money REAL NOT NULL,
    accountId INT NOT NULL,
    FOREIGN KEY (accountId) REFERENCES account(accountId) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO account VALUES
(1, 'testAdmin1@testAdmin.com', 'testAdmin1', 'testAdmin1', DEFAULT),
(2, 'testAdmin2@testAdmin.com', 'testAdmin2', 'testAdmin2', DEFAULT),
(10, 'testUser1@testAdmin.com', 'testUser1', 'testUser1', DEFAULT),
(11, 'testUser2@testAdmin.com', 'testUser2', 'testUser2', DEFAULT),
(3, 'admin', 'admin', 'admin', DEFAULT),
(4, 'user', 'user', 'user', DEFAULT);

INSERT INTO admin VALUES
(1, NULL),
(2, NULL),
(3, NULL);

INSERT INTO user VALUES (10, 'None'),
(11, 'Premium');

INSERT INTO playerOwnership VALUES (1, 999999999999.99, 1),
(2, 999999999999.99, 2),
(3, 10000, 10),
(4, 100000, 11);