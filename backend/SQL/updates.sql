UPDATE stock
		SET currentPrice = (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(now())
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(now())),
			24hChange = currentPrice - (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(now()) - 1
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(now()));

CREATE EVENT updateitemUsageEvent
    ON SCHEDULE EVERY 1 DAY STARTS '2020-01-01 00:00:00' ON COMPLETION PRESERVE ENABLE 
    DO
		UPDATE playerItemR
		SET usedToday = false;
        
CREATE EVENT updateItemAmountEvent
    ON SCHEDULE EVERY 1 WEEK STARTS '2020-01-01 00:00:00' ON COMPLETION PRESERVE ENABLE 
    DO
		UPDATE shopItemR
		SET amountAvailable = weeklyAmount;
        
CREATE EVENT updateStockEvent
    ON SCHEDULE EVERY 1 HOUR STARTS '2020-01-01 00:00:00' ON COMPLETION PRESERVE ENABLE
	DO
		UPDATE stock
		SET currentPrice = (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(now())
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(now())),
			24hChange = currentPrice - (
			SELECT price
			FROM stockRecordOwnership
			WHERE stockRecordOwnership.name = stock.name
			AND DAY(stockRecordOwnership.dateTime) = DAY(now()) - 1
			AND HOUR(stockRecordOwnership.dateTime) = HOUR(now()));