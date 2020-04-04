CREATE EVENT updateStockEvent
    ON SCHEDULE EVERY 1 HOUR STARTS '2020-01-01 00:00:00' ON COMPLETION PRESERVE ENABLE
	DO
		UPDATE stock
		SET currentPrice = (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(utc_time())
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(utc_time())),
			24hChange = currentPrice - (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(utc_time()) - 1
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(utc_time()));

INSERT INTO stockRecordOwnership VALUES (,,);