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