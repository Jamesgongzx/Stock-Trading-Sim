ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
SET default_storage_engine=InnoDB;
USE stocktradingsim;

INSERT INTO playerOwnership VALUES
(5, 10.0, 3),
(6, 999999999999.99, 3),
(7, 10000, 4),
(8, 100000, 4);