ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
SET default_storage_engine=InnoDB;
USE stocktradingsim;

INSERT INTO playerOwnership VALUES
(5, 10.0, 1),
(6, 999999999999.99, 1),
(7, 10000, 10),
(8, 100000, 10);

INSERT INTO stock VALUES
('GOOGL', 50.49, 2.4),
('HELLOWORLD', 100, -2.5);


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
