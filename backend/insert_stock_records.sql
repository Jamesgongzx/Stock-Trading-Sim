# Use 'SHOW VARIABLES LIKE "secure_file_priv"' to get path to put .csv files INFILE
# Example is for AMZN.csv
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/AMZN.csv'
INTO TABLE stockRecordOwnership 
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@dateTime, price, @dummy, @dummy,@dummy,@dummy)
SET dateTime = STR_TO_DATE(@dateTime,'%d.%m.%Y %H:%i:%s.%f'), name = 'AMZN';